"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Zap,
  Lock,
  Code2,
  Server,
  Globe,
  ArrowRight,
  FileText,
} from "lucide-react";

const STACK = [
  { label: "Frontend", items: ["Next.js 14 (App Router)", "Tailwind CSS", "Framer Motion", "pdf-lib"] },
  { label: "Backend", items: ["Python FastAPI", "pypdf", "PyMuPDF", "Pillow", "LibreOffice CLI"] },
  { label: "Privacy", items: ["No database", "No file storage", "Temp files deleted immediately", "No external APIs"] },
];

const VALUES = [
  {
    icon: Shield,
    title: "Privacy by Design",
    body: "Merge and Split run 100% in your browser — files never touch any server. Compress and Convert run on your own self-hosted backend. No third-party cloud ever sees your data.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    body: "Client-side operations use WebAssembly-powered pdf-lib for near-instant results even on large files. No upload queue. No wait time.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Lock,
    title: "Self-Hostable Backend",
    body: "The FastAPI backend is fully open-source. One docker-compose up and you have a complete, private PDF processing stack running on your own infrastructure.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Code2,
    title: "Open Source",
    body: "The entire codebase is open source. Audit it, fork it, or contribute to it. No hidden telemetry, no analytics, no ads.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {/* Ambient */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-900/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 items-center justify-center mb-6 shadow-xl shadow-violet-500/20">
            <FileText size={30} className="text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            About <span className="gradient-text">OprekPDF</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            OprekPDF is a privacy-first PDF tool platform. Every feature is designed
            with the assumption that your documents are confidential — because they
            probably are.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16"
        >
          {VALUES.map(({ icon: Icon, title, body, color, bg }) => (
            <motion.div key={title} variants={item}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Server size={18} className="text-violet-400" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STACK.map(({ label, items }) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-3 font-semibold">
                  {label}
                </p>
                <ul className="space-y-1.5">
                  {items.map((it) => (
                    <li key={it} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-violet-500 mt-0.5">·</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe size={18} className="text-blue-400" />
            How it works
          </h2>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              <span className="text-green-400 font-semibold">Merge &amp; Split</span> — These
              operations use <a href="https://pdf-lib.js.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">pdf-lib</a> which
              runs entirely in your browser via WebAssembly. Your PDFs are loaded into
              memory, processed, and the result is downloaded — nothing is ever sent over
              the network.
            </p>
            <p>
              <span className="text-blue-400 font-semibold">Compress, PDF↔Image, PDF↔DOCX</span> —
              These operations require server-side tools (pypdf, PyMuPDF, LibreOffice). They
              are sent to your <em>self-hosted</em> FastAPI backend, processed in a temporary
              directory, and the result is streamed back. The temporary files are deleted
              immediately after the response is sent.
            </p>
            <p>
              <span className="text-violet-400 font-semibold">Image → PDF</span> in client
              mode also uses pdf-lib; the server route is available as a fallback for
              unsupported image formats (WebP, TIFF, BMP).
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-violet-500/20"
          >
            Try the Tools
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
