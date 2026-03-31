import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OprekPDF — Privacy-First PDF Tools",
    template: "%s | OprekPDF",
  },
  description:
    "Merge, split, compress, and convert PDFs entirely locally. No uploads to external servers. No external AI. 100% private.",
  keywords: [
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "PDF converter",
    "PDF to Word",
    "Word to PDF",
    "privacy PDF",
    "offline PDF",
  ],
  openGraph: {
    title: "OprekPDF — Privacy-First PDF Tools",
    description: "Merge, split, compress, and convert PDFs — all locally.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#080810] text-white antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
