"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2 } from "lucide-react";
import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";
import FileList from "@/components/FileList";
import ResultCard from "@/components/ResultCard";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { mergePDFs } from "@/lib/pdf-client";

export default function MergePage() {
  const { files, addFiles, removeFile, reorder, clear } = useFileUpload({
    multiple: true,
    maxFiles: 50,
  });
  const { loading, error, result, process, reset } = useProcessing();

  const handleMerge = () => {
    process(async () => {
      if (files.length < 2) throw new Error("Add at least 2 PDFs to merge.");
      return mergePDFs(files.map((f) => f.file));
    });
  };

  const handleClear = () => {
    clear();
    reset();
  };

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDFs into one file. Drag the handles to reorder before merging."
      Icon={FileText}
      gradient="from-blue-500 to-cyan-500"
      shadowColor="shadow-blue-500/20"
      mode="client"
    >
      {/* Drop zone */}
      <FileDropzone
        onFilesSelected={(f) => {
          addFiles(f);
          reset();
        }}
        accept=".pdf,application/pdf"
        multiple
        label="Drop PDF files here"
        sublabel="or click to browse — you can add more later"
      />

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-400">
                {files.length} file{files.length !== 1 ? "s" : ""} &nbsp;·&nbsp;{" "}
                <span className="text-gray-600">drag handles to reorder</span>
              </p>
              <button
                onClick={handleClear}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear all
              </button>
            </div>

            <FileList files={files} onRemove={removeFile} onReorder={reorder} draggable />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action */}
      <AnimatePresence>
        {files.length >= 2 && !result && (
          <motion.button
            key="merge-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleMerge}
            disabled={loading}
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <FileText size={17} />
            Merge {files.length} PDFs
          </motion.button>
        )}
      </AnimatePresence>

      {/* Result */}
      <ResultCard
        loading={loading}
        error={error}
        result={result}
        loadingText="Merging PDFs in your browser…"
        successText="Merged successfully!"
        filename="merged.pdf"
      />
    </ToolPageLayout>
  );
}
