"use client";

import { Reorder, useDragControls } from "framer-motion";
import { FileText, GripVertical, Trash2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import type { UploadedFile } from "@/hooks/useFileUpload";

interface FileListProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
  onReorder: (files: UploadedFile[]) => void;
  draggable?: boolean;
}

function FileItem({
  item,
  index,
  onRemove,
  draggable,
}: {
  item: UploadedFile;
  index: number;
  onRemove: (id: string) => void;
  draggable: boolean;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={draggable ? controls : undefined}
      className="glass-card rounded-xl px-3 py-2.5 flex items-center gap-3 group"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
    >
      {draggable && (
        <button
          onPointerDown={(e) => controls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing text-gray-700 hover:text-gray-400 transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      )}

      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
        <FileText size={15} className="text-red-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate leading-tight">{item.name}</p>
        <p className="text-xs text-gray-600 mt-0.5">{formatBytes(item.size)}</p>
      </div>

      <span className="text-xs text-gray-700 tabular-nums w-5 text-right">{index + 1}</span>

      <button
        onClick={() => onRemove(item.id)}
        className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={14} />
      </button>
    </Reorder.Item>
  );
}

export default function FileList({
  files,
  onRemove,
  onReorder,
  draggable = true,
}: FileListProps) {
  if (files.length === 0) return null;

  return (
    <Reorder.Group
      axis="y"
      values={files}
      onReorder={onReorder}
      className="space-y-2"
    >
      {files.map((item, index) => (
        <FileItem
          key={item.id}
          item={item}
          index={index}
          onRemove={onRemove}
          draggable={draggable}
        />
      ))}
    </Reorder.Group>
  );
}
