/**
 * Client-side PDF operations using pdf-lib.
 * All processing happens in the browser — files never reach the server.
 */
import { PDFDocument } from "pdf-lib";

// ── Merge ────────────────────────────────────────────────────────────────────

export async function mergePDFs(files: File[]): Promise<Blob> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(bytes);
    } catch {
      throw new Error(
        `"${file.name}" could not be read. It may be corrupted or password-protected.`
      );
    }
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  const out = await merged.save();
  return new Blob([out], { type: "application/pdf" });
}

// ── Split ────────────────────────────────────────────────────────────────────

export async function splitPDFAllPages(file: File): Promise<Blob[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  const results: Blob[] = [];

  for (let i = 0; i < doc.getPageCount(); i++) {
    const single = await PDFDocument.create();
    const [page] = await single.copyPages(doc, [i]);
    single.addPage(page);
    const out = await single.save();
    results.push(new Blob([out], { type: "application/pdf" }));
  }

  return results;
}

export async function splitPDFByRange(
  file: File,
  start: number,
  end: number
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  const total = doc.getPageCount();

  if (start < 1 || end > total || start > end) {
    throw new Error(
      `Invalid range. The document has ${total} page${total !== 1 ? "s" : ""}.`
    );
  }

  const out = await PDFDocument.create();
  const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
  const pages = await out.copyPages(doc, indices);
  pages.forEach((p) => out.addPage(p));

  const bytes2 = await out.save();
  return new Blob([bytes2], { type: "application/pdf" });
}

// ── PDF metadata ─────────────────────────────────────────────────────────────

export async function getPDFPageCount(file: File): Promise<number> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

// ── Image → PDF ──────────────────────────────────────────────────────────────

export async function imagesToPDF(files: File[]): Promise<Blob> {
  const doc = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());

    let img;
    if (file.type === "image/png") {
      img = await doc.embedPng(bytes);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      img = await doc.embedJpg(bytes);
    } else {
      throw new Error(
        `"${file.name}" has an unsupported format. Only PNG and JPEG are supported for client-side conversion.`
      );
    }

    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const out = await doc.save();
  return new Blob([out], { type: "application/pdf" });
}
