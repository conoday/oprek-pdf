import io
import logging
import os
import platform
import shutil
import subprocess
import tempfile
import zipfile
from typing import List

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

router = APIRouter()
logger = logging.getLogger(__name__)

MAX_FILE_BYTES = 100 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp", "image/tiff"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _find_libreoffice() -> str | None:
    """Return the path to the LibreOffice executable, or None if not found."""
    if platform.system() == "Windows":
        candidates = [
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        ]
        for path in candidates:
            if os.path.exists(path):
                return path
    return shutil.which("libreoffice") or shutil.which("soffice")


def _require_libreoffice() -> str:
    path = _find_libreoffice()
    if not path:
        raise HTTPException(
            status_code=503,
            detail=(
                "LibreOffice is not installed on this server. "
                "Install it to enable document conversion."
            ),
        )
    return path


def _run_libreoffice(lo: str, convert_to: str, input_path: str, outdir: str) -> None:
    try:
        result = subprocess.run(
            [lo, "--headless", "--convert-to", convert_to, "--outdir", outdir, input_path],
            capture_output=True,
            text=True,
            timeout=120,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Conversion timed out (120 s).")
    except Exception as exc:
        logger.error("LibreOffice process error: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to launch conversion process.")

    if result.returncode != 0:
        logger.error("LibreOffice stderr: %s", result.stderr)
        raise HTTPException(status_code=500, detail="LibreOffice conversion failed.")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/pdf-to-image", summary="Convert PDF pages to images (returns ZIP)")
async def pdf_to_image(
    file: UploadFile = File(...),
    format: str = Form("png"),
    dpi: int = Form(150),
):
    try:
        import fitz  # PyMuPDF
    except ImportError:
        raise HTTPException(status_code=500, detail="PDF rendering library (PyMuPDF) is not installed.")

    if format not in ("png", "jpg", "jpeg"):
        raise HTTPException(status_code=400, detail="Format must be 'png' or 'jpg'.")
    if not (72 <= dpi <= 600):
        raise HTTPException(status_code=400, detail="DPI must be between 72 and 600.")

    content = await file.read()
    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Not a valid PDF file.")
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 100 MB limit.")

    try:
        doc = fitz.open(stream=content, filetype="pdf")
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        ext = "jpg" if format in ("jpg", "jpeg") else "png"

        zip_buf = io.BytesIO()
        with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for i, page in enumerate(doc):
                pix = page.get_pixmap(matrix=mat)
                zf.writestr(f"page_{i + 1:03d}.{ext}", pix.tobytes(output=ext))
        doc.close()

        zip_buf.seek(0)
        return StreamingResponse(
            zip_buf,
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="pdf_images.zip"'},
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("PDF-to-image error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to convert PDF to images.")


@router.post("/image-to-pdf", summary="Combine images into a single PDF")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    try:
        from PIL import Image
    except ImportError:
        raise HTTPException(status_code=500, detail="Image processing library (Pillow) is not installed.")

    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")

    images: list = []
    for upload in files:
        content = await upload.read()
        if len(content) > MAX_FILE_BYTES:
            raise HTTPException(status_code=413, detail=f"'{upload.filename}' exceeds 100 MB limit.")
        try:
            img = Image.open(io.BytesIO(content)).convert("RGB")
            images.append(img)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Could not open '{upload.filename}'. Unsupported or corrupted image.",
            )

    output = io.BytesIO()
    images[0].save(
        output,
        format="PDF",
        save_all=True,
        append_images=images[1:],
        resolution=150.0,
    )
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="images_to_pdf.pdf"'},
    )


@router.post("/pdf-to-docx", summary="Convert PDF to DOCX via LibreOffice")
async def pdf_to_docx(file: UploadFile = File(...)):
    lo = _require_libreoffice()
    content = await file.read()

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Not a valid PDF file.")
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 100 MB limit.")

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = os.path.join(tmpdir, "input.pdf")
        output_path = os.path.join(tmpdir, "input.docx")

        with open(input_path, "wb") as f:
            f.write(content)

        _run_libreoffice(lo, "docx", input_path, tmpdir)

        if not os.path.exists(output_path):
            raise HTTPException(status_code=500, detail="PDF to DOCX conversion produced no output.")

        with open(output_path, "rb") as f:
            docx_content = f.read()

    base = (file.filename or "document.pdf").rsplit(".", 1)[0]
    return StreamingResponse(
        io.BytesIO(docx_content),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{base}.docx"'},
    )


@router.post("/docx-to-pdf", summary="Convert DOCX/ODT/RTF to PDF via LibreOffice")
async def docx_to_pdf(file: UploadFile = File(...)):
    lo = _require_libreoffice()
    content = await file.read()

    filename = file.filename or "document.docx"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "docx"

    if ext not in ("docx", "doc", "odt", "rtf"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use DOCX, DOC, ODT, or RTF.")
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 100 MB limit.")
    # Basic PK zip header check for docx/odt (not for rtf/doc)
    if ext in ("docx", "odt") and not content.startswith(b"PK"):
        raise HTTPException(status_code=400, detail=f"'{filename}' does not appear to be a valid {ext.upper()} file.")

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = os.path.join(tmpdir, f"input.{ext}")
        output_path = os.path.join(tmpdir, "input.pdf")

        with open(input_path, "wb") as f:
            f.write(content)

        _run_libreoffice(lo, "pdf", input_path, tmpdir)

        if not os.path.exists(output_path):
            raise HTTPException(status_code=500, detail="DOCX to PDF conversion produced no output.")

        with open(output_path, "rb") as f:
            pdf_content = f.read()

    base = filename.rsplit(".", 1)[0]
    return StreamingResponse(
        io.BytesIO(pdf_content),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{base}.pdf"'},
    )
