import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import merge, split, compress, convert

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s – %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OprekPDF API",
    description="Privacy-first PDF processing – all files are processed in memory and never persisted.",
    version="1.0.0",
)

_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Original-Size", "X-Compressed-Size", "X-Reduction-Percent"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error."})


app.include_router(merge.router, prefix="/api/merge", tags=["Merge"])
app.include_router(split.router, prefix="/api/split", tags=["Split"])
app.include_router(compress.router, prefix="/api/compress", tags=["Compress"])
app.include_router(convert.router, prefix="/api/convert", tags=["Convert"])


@app.get("/", tags=["Health"])
async def root():
    return {"service": "OprekPDF API", "version": "1.0.0", "status": "OK"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
