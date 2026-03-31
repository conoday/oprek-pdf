import io
import logging
import zipfile

import pypdf
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

router = APIRouter()
logger = logging.getLogger(__name__)

MAX_FILE_BYTES = 100 * 1024 * 1024


def _load_pdf(content: bytes, filename: str) -> pypdf.PdfReader:
    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail=f"'{filename}' is not a valid PDF file.")
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 100 MB size limit.")
    try:
        return pypdf.PdfReader(io.BytesIO(content))
    except Exception as exc:
        logger.warning("Could not open PDF '%s': %s", filename, exc)
        raise HTTPException(
            status_code=400,
            detail=f"Could not read '{filename}'. It may be corrupted or password-protected.",
        )


@router.post("/pages", summary="Split a PDF into individual pages (returns ZIP)")
async def split_into_pages(file: UploadFile = File(...)):
    content = await file.read()
    reader = _load_pdf(content, file.filename or "document.pdf")

    if len(reader.pages) == 0:
        raise HTTPException(status_code=400, detail="The PDF contains no pages.")

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for i, page in enumerate(reader.pages):
            writer = pypdf.PdfWriter()
            writer.add_page(page)
            page_buf = io.BytesIO()
            writer.write(page_buf)
            zf.writestr(f"page_{i + 1:03d}.pdf", page_buf.getvalue())

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="split_pages.zip"'},
    )


@router.post("/range", summary="Extract a page range from a PDF")
async def split_by_range(
    file: UploadFile = File(...),
    start: int = Form(..., ge=1, description="First page (1-based)"),
    end: int = Form(..., ge=1, description="Last page (1-based, inclusive)"),
):
    content = await file.read()
    reader = _load_pdf(content, file.filename or "document.pdf")
    total = len(reader.pages)

    if start > end:
        raise HTTPException(status_code=400, detail="'start' must be ≤ 'end'.")
    if end > total:
        raise HTTPException(
            status_code=400,
            detail=f"Page {end} exceeds document length ({total} pages).",
        )

    writer = pypdf.PdfWriter()
    for i in range(start - 1, end):
        writer.add_page(reader.pages[i])

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="pages_{start}_to_{end}.pdf"',
        },
    )
