"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  gradient: string;
  shadowColor: string;
  mode?: "client" | "server";
  children: React.ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  Icon,
  gradient,
  shadowColor,
  mode = "client",
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-300 transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          All Tools
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-4 mb-8"
        >
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              "bg-gradient-to-br text-white shadow-lg",
              gradient,
              shadowColor
            )}
          >
            <Icon size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">{description}</p>

            <div
              className={cn(
                "inline-flex items-center gap-1.5 mt-2 text-xs font-medium px-2 py-0.5 rounded-full",
                mode === "client"
                  ? "text-green-400 bg-green-500/10"
                  : "text-blue-400 bg-blue-500/10"
              )}
            >
              {mode === "client" ? (
                <>
                  <Zap size={11} className="fill-green-400" />
                  Client-side — files never leave your device
                </>
              ) : (
                <>
                  <Server size={11} />
                  Self-hosted backend — no external services
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tool content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
