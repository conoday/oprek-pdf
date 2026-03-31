"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

interface ResultCardProps {
  loading: boolean;
  error: string | null;
  result: Blob | null;
  loadingText?: string;
  successText?: string;
  filename?: string;
  extraInfo?: React.ReactNode;
  className?: string;
}

export default function ResultCard({
  loading,
  error,
  result,
  loadingText = "Processing…",
  successText = "Done!",
  filename = "result.pdf",
  extraInfo,
  className,
}: ResultCardProps) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn(
            "mt-5 glass-card rounded-2xl p-5 flex items-center gap-4",
            className
          )}
        >
          <Loader2 className="text-violet-400 animate-spin flex-shrink-0" size={22} />
          <p className="text-sm text-gray-300 font-medium">{loadingText}</p>
        </motion.div>
      )}

      {error && !loading && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            "mt-5 rounded-2xl p-4 border border-red-500/20 bg-red-500/8",
            "flex items-start gap-3",
            className
          )}
        >
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {result && !loading && (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn(
            "mt-5 rounded-2xl p-4 border border-green-500/20 bg-green-500/8",
            "flex items-center justify-between gap-4",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-300">{successText}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatBytes(result.size)}</p>
              {extraInfo && <div className="mt-1">{extraInfo}</div>}
            </div>
          </div>

          <button
            onClick={() => downloadBlob(result, filename)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-green-900/30"
          >
            <Download size={15} />
            Download
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
