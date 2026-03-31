import io
import logging

import pypdf
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

router = APIRouter()
logger = logging.getLogger(__name__)

MAX_FILE_BYTES = 100 * 1024 * 1024


@router.post("", summary="Compress a PDF by optimising content streams")
async def compress_pdf(file: UploadFile = File(...)):
    content = await file.read()

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Not a valid PDF file.")
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 100 MB size limit.")

    original_size = len(content)

    try:
        reader = pypdf.PdfReader(io.BytesIO(content))
        writer = pypdf.PdfWriter()

        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)

        # Strip document metadata to shave extra bytes
        writer.add_metadata({"/Producer": "OprekPDF"})

        output = io.BytesIO()
        writer.write(output)
        compressed_bytes = output.getvalue()

        compressed_size = len(compressed_bytes)
        reduction = round((1 - compressed_size / original_size) * 100, 1) if original_size else 0.0

        output.seek(0)
        base = (file.filename or "document.pdf").rsplit(".", 1)[0]

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{base}_compressed.pdf"',
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size),
                "X-Reduction-Percent": str(reduction),
            },
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Compress error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to compress the PDF.")
