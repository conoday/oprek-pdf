const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

// ── Error type ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse(res: Response): Promise<Blob> {
  if (!res.ok) {
    let detail = "Request failed";
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, detail);
  }
  return res.blob();
}

// ── Compress ──────────────────────────────────────────────────────────────────

export interface CompressStats {
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
}

export async function compressPDF(
  file: File
): Promise<{ blob: Blob; stats: CompressStats }> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_URL}/api/compress`, { method: "POST", body: fd });

  if (!res.ok) {
    let detail = "Compression failed";
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, detail);
  }

  const blob = await res.blob();
  const stats: CompressStats = {
    originalSize: parseInt(res.headers.get("X-Original-Size") ?? "0"),
    compressedSize: parseInt(res.headers.get("X-Compressed-Size") ?? "0"),
    reductionPercent: parseFloat(res.headers.get("X-Reduction-Percent") ?? "0"),
  };

  return { blob, stats };
}

// ── PDF → Images ──────────────────────────────────────────────────────────────

export async function pdfToImages(
  file: File,
  format: "png" | "jpg" = "png",
  dpi = 150
): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("format", format);
  fd.append("dpi", String(dpi));

  const res = await fetch(`${API_URL}/api/convert/pdf-to-image`, {
    method: "POST",
    body: fd,
  });
  return handleResponse(res);
}

// ── Image → PDF (server) ──────────────────────────────────────────────────────

export async function imagesToPDFServer(files: File[]): Promise<Blob> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));

  const res = await fetch(`${API_URL}/api/convert/image-to-pdf`, {
    method: "POST",
    body: fd,
  });
  return handleResponse(res);
}

// ── PDF → DOCX ────────────────────────────────────────────────────────────────

export async function pdfToDocx(file: File): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_URL}/api/convert/pdf-to-docx`, {
    method: "POST",
    body: fd,
  });
  return handleResponse(res);
}

// ── DOCX → PDF ────────────────────────────────────────────────────────────────

export async function docxToPDF(file: File): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_URL}/api/convert/docx-to-pdf`, {
    method: "POST",
    body: fd,
  });
  return handleResponse(res);
}
