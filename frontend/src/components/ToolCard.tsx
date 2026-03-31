"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
  gradient: string;
  shadowColor: string;
  badge?: string;
  badgeColor?: string;
  delay?: number;
}

export default function ToolCard({
  title,
  description,
  Icon,
  href,
  gradient,
  shadowColor,
  badge,
  badgeColor = "bg-green-500/10 text-green-400 border-green-500/20",
  delay = 0,
}: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="group block h-full">
        <div
          className={cn(
            "glass-card glass-card-hover h-full rounded-2xl p-5",
            "flex flex-col gap-4 transition-all duration-300",
            "hover:shadow-xl",
            shadowColor
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
              gradient
            )}
          >
            <Icon size={22} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-white text-[15px] leading-tight">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {badge && (
              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                  badgeColor
                )}
              >
                {badge}
              </span>
            )}
            <ArrowRight
              size={16}
              className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 ml-auto"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
