"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileDown, TrendingDown } from "lucide-react";

import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { compressPDF, type CompressStats } from "@/lib/api";
import { formatBytes } from "@/lib/utils";

export default function CompressPage() {
  const { files, addFiles, clear } = useFileUpload({ multiple: false });
  const { loading, error, result, extra, process, reset } =
    useProcessing<CompressStats>();

  const file = files[0] ?? null;

  const handleCompress = () => {
    process(async () => {
      if (!file) throw new Error("No file selected.");
      const { blob, stats } = await compressPDF(file.file);
      return { blob, extra: stats };
    });
  };

  const handleClear = () => {
    clear();
    reset();
  };

  const stats = extra as CompressStats | null;

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce PDF file size by optimising content streams. Processed on your self-hosted backend."
      Icon={FileDown}
      gradient="from-orange-500 to-pink-500"
      shadowColor="shadow-orange-500/20"
      mode="server"
    >
      {/* Drop zone */}
      <FileDropzone
        onFilesSelected={(f) => {
          addFiles(f);
          reset();
        }}
        accept=".pdf,application/pdf"
        multiple={false}
        label="Drop a PDF here"
        sublabel="or click to browse"
      />

      {file && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            <span className="text-white font-medium">{file.name}</span>
            <span className="text-gray-600 ml-2">({formatBytes(file.size)})</span>
          </span>
          <button
            onClick={handleClear}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Action */}
      <AnimatePresence>
        {file && !result && (
          <motion.button
            key="compress-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleCompress}
            disabled={loading}
            className="mt-5 w-full py-3.5 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
          >
            Compress PDF
          </motion.button>
        )}
      </AnimatePresence>

      {/* Result */}
      <ResultCard
        loading={loading}
        error={error}
        result={result}
        loadingText="Compressing via self-hosted backend…"
        successText="Compressed successfully!"
        filename={
          file ? `${file.name.replace(/\.pdf$/i, "")}_compressed.pdf` : "compressed.pdf"
        }
        extraInfo={
          stats && (
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5">
              <span>{formatBytes(stats.originalSize)} → {formatBytes(stats.compressedSize)}</span>
              {stats.reductionPercent > 0 && (
                <span className="flex items-center gap-1 text-green-400">
                  <TrendingDown size={12} />
                  {stats.reductionPercent}% smaller
                </span>
              )}
            </div>
          )
        }
      />
    </ToolPageLayout>
  );
}
