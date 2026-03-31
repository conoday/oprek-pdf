"use client";

import { motion } from "framer-motion";
import {
  FileText,
  FileMinus,
  FileDown,
  Image,
  FileImage,
  FileUp,
  FileType2,
} from "lucide-react";
import ToolCard from "@/components/ToolCard";
import type { Metadata } from "next";

const TOOLS = [
  {
    title: "Merge PDF",
    description:
      "Combine multiple PDFs into one file. Drag to reorder pages before merging.",
    Icon: FileText,
    href: "/merge",
    gradient: "from-blue-500 to-cyan-500",
    shadowColor: "hover:shadow-blue-900/30",
    badge: "Client-side",
  },
  {
    title: "Split PDF",
    description:
      "Split a PDF into individual pages or extract a specific page range.",
    Icon: FileMinus,
    href: "/split",
    gradient: "from-violet-500 to-purple-600",
    shadowColor: "hover:shadow-violet-900/30",
    badge: "Client-side",
  },
  {
    title: "Compress PDF",
    description:
      "Reduce PDF file size by optimising content streams and removing metadata.",
    Icon: FileDown,
    href: "/compress",
    gradient: "from-orange-500 to-pink-500",
    shadowColor: "hover:shadow-orange-900/30",
    badge: "Self-hosted",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    title: "PDF → Image",
    description:
      "Convert every page of a PDF to high-quality PNG or JPG images.",
    Icon: Image,
    href: "/convert/pdf-to-image",
    gradient: "from-green-500 to-emerald-600",
    shadowColor: "hover:shadow-green-900/30",
    badge: "Self-hosted",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    title: "Image → PDF",
    description:
      "Combine one or more images (PNG/JPG) into a single PDF document.",
    Icon: FileImage,
    href: "/convert/image-to-pdf",
    gradient: "from-teal-500 to-cyan-600",
    shadowColor: "hover:shadow-teal-900/30",
    badge: "Client-side",
  },
  {
    title: "PDF → DOCX",
    description:
      "Convert PDF documents to editable Word format via LibreOffice.",
    Icon: FileType2,
    href: "/convert/pdf-to-docx",
    gradient: "from-indigo-500 to-blue-600",
    shadowColor: "hover:shadow-indigo-900/30",
    badge: "Self-hosted",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    title: "DOCX → PDF",
    description:
      "Convert Word documents (DOCX, DOC, ODT, RTF) to PDF via LibreOffice.",
    Icon: FileUp,
    href: "/convert/docx-to-pdf",
    gradient: "from-pink-500 to-rose-600",
    shadowColor: "hover:shadow-pink-900/30",
    badge: "Self-hosted",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {/* Ambient */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            All <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Seven privacy-first PDF tools. Client-side operations run entirely in your
            browser. Self-hosted operations use your own backend.
          </p>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Client-side — files never leave your device
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Self-hosted — your own backend only
            </span>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.href} {...tool} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </div>
  );
}
