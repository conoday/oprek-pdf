import io
import logging
from typing import List

import pypdf
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

router = APIRouter()
logger = logging.getLogger(__name__)

MAX_FILES = 50
MAX_FILE_BYTES = 100 * 1024 * 1024  # 100 MB per file


def _validate_pdf(content: bytes, filename: str) -> None:
    if not content.startswith(b"%PDF"):
        raise HTTPException(
            status_code=400,
            detail=f"'{filename}' is not a valid PDF file.",
        )
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"'{filename}' exceeds the 100 MB size limit.",
        )


@router.post("", summary="Merge multiple PDFs into one")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required.")
    if len(files) > MAX_FILES:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_FILES} files allowed.")

    writer = pypdf.PdfWriter()

    for upload in files:
        content = await upload.read()
        _validate_pdf(content, upload.filename or "unknown")

        try:
            reader = pypdf.PdfReader(io.BytesIO(content))
            for page in reader.pages:
                writer.add_page(page)
        except Exception as exc:
            logger.warning("Could not read PDF '%s': %s", upload.filename, exc)
            raise HTTPException(
                status_code=400,
                detail=f"Could not read '{upload.filename}'. The file may be corrupted or password-protected.",
            )

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="merged.pdf"',
            "X-Process-Mode": "server",
        },
    )
