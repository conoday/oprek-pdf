"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const toolLinks = [
  { href: "/merge", label: "Merge" },
  { href: "/split", label: "Split" },
  { href: "/compress", label: "Compress" },
  { href: "/convert/pdf-to-image", label: "PDF → Image" },
  { href: "/convert/image-to-pdf", label: "Image → PDF" },
  { href: "/convert/pdf-to-docx", label: "PDF → DOCX" },
  { href: "/convert/docx-to-pdf", label: "DOCX → PDF" },
];

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#080810]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Oprek<span className="text-violet-400">PDF</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools dropdown */}
            <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
              <button
                onMouseEnter={() => setToolsOpen(true)}
                onClick={() => setToolsOpen((v) => !v)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                Tools
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", toolsOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 glass-card rounded-xl p-1.5 shadow-xl shadow-black/40"
                  >
                    {toolLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors",
                          pathname === href
                            ? "bg-violet-500/15 text-violet-300"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg transition-all",
                  pathname === href
                    ? "text-white bg-white/[0.07]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/tools"
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#0c0c16]/95 backdrop-blur-xl border-b border-white/[0.06]"
          >
            <div className="px-4 py-3 space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-gray-600 px-3 py-1">Tools</p>
              {toolLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-3 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {label}
                </Link>
              ))}
              <div className="h-px bg-white/[0.06] my-2" />
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-3 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <Link
                  href="/tools"
                  className="block text-center px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
