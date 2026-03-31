"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function FileDropzone({
  onFilesSelected,
  accept = ".pdf",
  multiple = false,
  label = "Drop files here",
  sublabel = "or click to browse",
  maxSizeMB = 100,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      setError(null);

      const valid: File[] = [];
      for (const file of Array.from(list)) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`"${file.name}" exceeds the ${maxSizeMB} MB limit.`);
          return;
        }
        valid.push(file);
      }

      if (valid.length > 0) onFilesSelected(valid);
    },
    [onFilesSelected, maxSizeMB]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div className={cn("w-full", className)}>
      <label
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px]",
          "rounded-2xl border-2 border-dashed cursor-pointer",
          "transition-all duration-300 select-none",
          isDragging
            ? "border-violet-500/70 bg-violet-500/10"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setIsDragging(false)}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            processFiles(e.target.files);
            e.target.value = "";
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <motion.div
          animate={{ scale: isDragging ? 1.04 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-3 py-8 pointer-events-none px-6 text-center"
        >
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
              isDragging
                ? "bg-violet-500/20 text-violet-400"
                : "bg-white/[0.06] text-gray-500"
            )}
          >
            <Upload size={24} />
          </div>

          <div>
            <p className="font-semibold text-white text-[15px]">{label}</p>
            <p className="text-sm text-gray-500 mt-1">{sublabel}</p>
            <p className="text-xs text-gray-600 mt-2 font-mono">
              {accept.replace(/application\//g, "").replace(/,/g, " · ").toUpperCase()} &nbsp;·&nbsp; Max {maxSizeMB} MB
            </p>
          </div>
        </motion.div>
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1.5 text-sm text-red-400"
        >
          <X size={13} />
          {error}
        </motion.p>
      )}
    </div>
  );
}
