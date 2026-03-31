"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileMinus, Download } from "lucide-react";

import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import {
  splitPDFAllPages,
  splitPDFByRange,
  getPDFPageCount,
} from "@/lib/pdf-client";
import { downloadBlob } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Mode = "all" | "range";

export default function SplitPage() {
  const { files, addFiles, clear } = useFileUpload({ multiple: false });
  const { loading, error, result, process, reset } = useProcessing();

  const [mode, setMode] = useState<Mode>("all");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [splitBlobs, setSplitBlobs] = useState<Blob[]>([]);

  const file = files[0] ?? null;

  useEffect(() => {
    if (!file) {
      setPageCount(null);
      setSplitBlobs([]);
      reset();
      return;
    }
    getPDFPageCount(file.file)
      .then((n) => {
        setPageCount(n);
        setEnd(n);
      })
      .catch(() => setPageCount(null));
  }, [file]);

  const handleSplit = () => {
    setSplitBlobs([]);
    reset();

    if (mode === "all") {
      process(async () => {
        const blobs = await splitPDFAllPages(file!.file);
        setSplitBlobs(blobs);
        // Return the first page blob so the hook registers a result;
        // all individual downloads are rendered separately below.
        return blobs[0];
      });
    } else {
      process(async () => splitPDFByRange(file!.file, start, end));
    }
  };

  const handleClear = () => {
    clear();
    reset();
    setSplitBlobs([]);
    setPageCount(null);
  };

  const canSplit = !!file && !loading;

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Split a PDF into individual pages or extract a specific page range."
      Icon={FileMinus}
      gradient="from-violet-500 to-purple-600"
      shadowColor="shadow-violet-500/20"
      mode="client"
    >
      {/* Drop zone */}
      <FileDropzone
        onFilesSelected={(f) => {
          addFiles(f);
          reset();
          setSplitBlobs([]);
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
            {pageCount !== null && (
              <span className="text-gray-600 ml-2">({pageCount} pages)</span>
            )}
          </span>
          <button
            onClick={handleClear}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Mode tabs */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <div className="flex rounded-xl p-1 bg-white/[0.04] border border-white/[0.08] mb-5">
              {(["all", "range"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); reset(); setSplitBlobs([]); }}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                    mode === m
                      ? "bg-white/[0.08] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {m === "all" ? "Split all pages" : "Extract range"}
                </button>
              ))}
            </div>

            {/* Range inputs */}
            {mode === "range" && (
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From page</label>
                  <input
                    type="number"
                    min={1}
                    max={pageCount ?? 9999}
                    value={start}
                    onChange={(e) => setStart(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <span className="text-gray-600 mt-5">–</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To page</label>
                  <input
                    type="number"
                    min={start}
                    max={pageCount ?? 9999}
                    value={end}
                    onChange={(e) => setEnd(Math.max(start, parseInt(e.target.value) || start))}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Action */}
            {!result && (
              <button
                onClick={handleSplit}
                disabled={!canSplit}
                className="mt-5 w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
              >
                {mode === "all" ? "Split into pages" : `Extract pages ${start}–${end}`}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-page download list (split-all mode) */}
      {splitBlobs.length > 1 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 glass-card rounded-2xl p-4 space-y-2"
        >
          <p className="text-sm font-semibold text-green-300 mb-3">
            {splitBlobs.length} pages extracted
          </p>
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {splitBlobs.map((blob, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-sm text-gray-300">Page {i + 1}</span>
                <button
                  onClick={() => downloadBlob(blob, `page_${String(i + 1).padStart(3, "0")}.pdf`)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <Download size={13} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Result for range mode */}
      {mode === "range" && (
        <ResultCard
          loading={loading}
          error={error}
          result={result}
          loadingText="Extracting pages…"
          successText="Pages extracted!"
          filename={`pages_${start}_to_${end}.pdf`}
        />
      )}

      {/* Error for split-all */}
      {mode === "all" && error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}
    </ToolPageLayout>
  );
}
