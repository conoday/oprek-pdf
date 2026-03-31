"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  FileText,
  FileMinus,
  FileDown,
  RefreshCw,
  Star,
} from "lucide-react";
import ToolCard from "@/components/ToolCard";

const TOOLS = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs in any order.",
    Icon: FileText,
    href: "/merge",
    gradient: "from-blue-500 to-cyan-500",
    shadowColor: "hover:shadow-blue-900/30",
    badge: "Client-side",
  },
  {
    title: "Split PDF",
    description: "Extract pages or split into individual files.",
    Icon: FileMinus,
    href: "/split",
    gradient: "from-violet-500 to-purple-600",
    shadowColor: "hover:shadow-violet-900/30",
    badge: "Client-side",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size without losing quality.",
    Icon: FileDown,
    href: "/compress",
    gradient: "from-orange-500 to-pink-500",
    shadowColor: "hover:shadow-orange-900/30",
    badge: "Self-hosted",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    title: "Convert",
    description: "PDF↔DOCX, PDF→Image, Image→PDF.",
    Icon: RefreshCw,
    href: "/tools",
    gradient: "from-green-500 to-teal-500",
    shadowColor: "hover:shadow-green-900/30",
    badge: "Self-hosted",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
] as const;

const FEATURES = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Merge & Split operations run entirely in your browser. Files are never sent to any server.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Client-side processing means no upload wait time. Large PDFs processed in seconds.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Lock,
    title: "Self-hostable",
    description:
      "Backend is fully open source. Deploy on your own infra — no external APIs ever.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Ambient background ─────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] bg-blue-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-20 pb-12">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-300 text-sm font-medium mb-8">
              <Star size={13} className="fill-violet-400 text-violet-400" />
              100% Private &nbsp;·&nbsp; No external APIs &nbsp;·&nbsp; Open source
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
              <span className="text-white">PDF Tools</span>
              <br />
              <span className="gradient-text">Built for Privacy</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Merge, split, compress, and convert PDFs — processed locally in your browser
              or on your own self-hosted backend. Zero cloud. Zero leaks.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tools"
                className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 flex items-center justify-center gap-2"
              >
                Explore Tools
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 glass-card glass-card-hover text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Privacy pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-14"
          >
            {["No file storage", "No tracking", "No ads", "Works offline"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs text-gray-500 border border-white/[0.07] rounded-full bg-white/[0.03]"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tools ──────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need</h2>
            <p className="text-gray-500">Seven tools, zero dependencies on external services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.href} {...tool} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <motion.div key={title} variants={item}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon size={20} className={color} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 text-center relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to process your PDFs?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              No sign-up. No credit card. Just fast, private PDF tools — free forever.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-violet-500/20"
            >
              Try for Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
