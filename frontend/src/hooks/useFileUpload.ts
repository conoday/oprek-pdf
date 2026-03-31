"use client";

import { useState, useCallback } from "react";
import { generateId } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface Options {
  multiple?: boolean;
  maxFiles?: number;
}

export function useFileUpload({ multiple = false, maxFiles = 50 }: Options = {}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFiles = useCallback(
    (incoming: File[]) => {
      const entries: UploadedFile[] = incoming.map((file) => ({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
      }));

      if (multiple) {
        setFiles((prev) => [...prev, ...entries].slice(0, maxFiles));
      } else {
        setFiles(entries.slice(0, 1));
      }
    },
    [multiple, maxFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const reorder = useCallback((newOrder: UploadedFile[]) => {
    setFiles(newOrder);
  }, []);

  const clear = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, addFiles, removeFile, reorder, clear };
}
