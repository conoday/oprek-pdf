import Link from "next/link";
import { FileText, Github, Shield, Zap } from "lucide-react";

const tools = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/compress", label: "Compress PDF" },
  { href: "/convert/pdf-to-image", label: "PDF → Image" },
  { href: "/convert/image-to-pdf", label: "Image → PDF" },
  { href: "/convert/pdf-to-docx", label: "PDF → DOCX" },
  { href: "/convert/docx-to-pdf", label: "DOCX → PDF" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060608]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <FileText size={14} className="text-white" />
              </div>
              <span className="font-bold text-white">
                Oprek<span className="text-violet-400">PDF</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Privacy-first PDF tools. All processing is done locally — no data ever
              leaves your device or your own server.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <Shield size={12} />
                No tracking
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <Zap size={12} />
                No ads
              </div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-4">Tools</p>
            <ul className="space-y-2">
              {tools.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-4">Project</p>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/tools", label: "All Tools" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-700">
          <p>© {new Date().getFullYear()} OprekPDF. Open-source & free.</p>
          <p>Built with Next.js · FastAPI · pdf-lib · PyMuPDF</p>
        </div>
      </div>
    </footer>
  );
}
