"use client";

import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  FileImage,
  FileType2,
  FileUp,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";
import FileList from "@/components/FileList";
import ResultCard from "@/components/ResultCard";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { imagesToPDF } from "@/lib/pdf-client";
import { pdfToImages, pdfToDocx, docxToPDF } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ── Config per type ───────────────────────────────────────────────────────────

interface ConvertConfig {
  title: string;
  description: string;
  Icon: LucideIcon;
  gradient: string;
  shadowColor: string;
  accept: string;
  multiple: boolean;
  mode: "client" | "server";
  outputExt: string;
  actionLabel: string;
}

const CONFIG: Record<string, ConvertConfig> = {
  "pdf-to-image": {
    title: "PDF → Image",
    description:
      "Convert each page of a PDF to a PNG or JPG image. Processed on your self-hosted backend.",
    Icon: Image,
    gradient: "from-green-500 to-emerald-600",
    shadowColor: "shadow-green-500/20",
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "server",
    outputExt: "zip",
    actionLabel: "Convert to Images",
  },
  "image-to-pdf": {
    title: "Image → PDF",
    description:
      "Combine one or more PNG/JPG images into a single PDF. Processed entirely in your browser.",
    Icon: FileImage,
    gradient: "from-teal-500 to-cyan-600",
    shadowColor: "shadow-teal-500/20",
    accept: "image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg",
    multiple: true,
    mode: "client",
    outputExt: "pdf",
    actionLabel: "Convert to PDF",
  },
  "pdf-to-docx": {
    title: "PDF → DOCX",
    description:
      "Convert a PDF to an editable Word document using LibreOffice on your self-hosted backend.",
    Icon: FileType2,
    gradient: "from-indigo-500 to-blue-600",
    shadowColor: "shadow-indigo-500/20",
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "server",
    outputExt: "docx",
    actionLabel: "Convert to DOCX",
  },
  "docx-to-pdf": {
    title: "DOCX → PDF",
    description:
      "Convert Word documents (DOCX, DOC, ODT, RTF) to PDF via LibreOffice on your self-hosted backend.",
    Icon: FileUp,
    gradient: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/20",
    accept: ".docx,.doc,.odt,.rtf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple: false,
    mode: "server",
    outputExt: "pdf",
    actionLabel: "Convert to PDF",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConvertPage({ params }: { params: { type: string } }) {
  const config = CONFIG[params.type];
  if (!config) notFound();

  const { files, addFiles, removeFile, reorder, clear } = useFileUpload({
    multiple: config.multiple,
  });
  const { loading, error, result, process, reset } = useProcessing();

  // PDF→Image options
  const [imgFormat, setImgFormat] = useState<"png" | "jpg">("png");
  const [dpi, setDpi] = useState(150);

  const handleConvert = () => {
    if (files.length === 0) return;
    reset();

    process(async () => {
      const type = params.type;

      if (type === "pdf-to-image") {
        return pdfToImages(files[0].file, imgFormat, dpi);
      }

      if (type === "image-to-pdf") {
        return imagesToPDF(files.map((f) => f.file));
      }

      if (type === "pdf-to-docx") {
        return pdfToDocx(files[0].file);
      }

      if (type === "docx-to-pdf") {
        return docxToPDF(files[0].file);
      }

      throw new Error("Unknown conversion type.");
    });
  };

  const handleClear = () => {
    clear();
    reset();
  };

  const outputName = () => {
    if (files.length === 0) return `output.${config.outputExt}`;
    const base = files[0].name.replace(/\.[^.]+$/, "");
    if (params.type === "image-to-pdf") return "images_to_pdf.pdf";
    if (params.type === "pdf-to-image") return "pdf_images.zip";
    return `${base}.${config.outputExt}`;
  };

  return (
    <ToolPageLayout
      title={config.title}
      description={config.description}
      Icon={config.Icon}
      gradient={config.gradient}
      shadowColor={config.shadowColor}
      mode={config.mode}
    >
      {/* Drop zone */}
      <FileDropzone
        onFilesSelected={(f) => {
          addFiles(f);
          reset();
        }}
        accept={config.accept}
        multiple={config.multiple}
        label={`Drop ${config.multiple ? "files" : "a file"} here`}
        sublabel="or click to browse"
      />

      {/* File list for multi-upload */}
      <AnimatePresence>
        {config.multiple && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">
                {files.length} image{files.length !== 1 ? "s" : ""} selected
                <span className="text-gray-600 ml-1">· drag to reorder</span>
              </p>
              <button
                onClick={handleClear}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
            <FileList files={files} onRemove={removeFile} onReorder={reorder} draggable />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single file indicator */}
      {!config.multiple && files.length > 0 && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            <span className="text-white font-medium">{files[0].name}</span>
          </span>
          <button
            onClick={handleClear}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* PDF→Image options */}
      <AnimatePresence>
        {params.type === "pdf-to-image" && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 grid grid-cols-2 gap-3"
          >
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Image format</label>
              <div className="flex rounded-xl p-1 bg-white/[0.04] border border-white/[0.08]">
                {(["png", "jpg"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setImgFormat(fmt)}
                    className={cn(
                      "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all uppercase",
                      imgFormat === fmt
                        ? "bg-white/[0.08] text-white"
                        : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                DPI &nbsp;<span className="text-gray-700">({dpi})</span>
              </label>
              <input
                type="range"
                min={72}
                max={300}
                step={1}
                value={dpi}
                onChange={(e) => setDpi(parseInt(e.target.value))}
                className="w-full accent-green-500 mt-2"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action */}
      <AnimatePresence>
        {files.length > 0 && !result && (
          <motion.button
            key="convert-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleConvert}
            disabled={loading}
            className={cn(
              "mt-5 w-full py-3.5 text-white font-semibold rounded-xl",
              "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all shadow-lg bg-gradient-to-r",
              config.gradient
            )}
          >
            {config.actionLabel}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Result */}
      <ResultCard
        loading={loading}
        error={error}
        result={result}
        loadingText={`Converting${config.mode === "server" ? " via self-hosted backend" : " in your browser"}…`}
        successText="Conversion complete!"
        filename={outputName()}
      />
    </ToolPageLayout>
  );
}
