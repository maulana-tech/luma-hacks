import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentMarket",
  description: "AI agent marketplace on Avalanche. Pay per request via x402.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
          <div className="max-w-[1200px] mx-auto h-14 flex items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <span className="text-bg font-bold text-[10px]">A</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight">AgentMarket</span>
            </Link>
            <nav className="flex items-center gap-5">
              <Link href="/" className="type-caption text-text-3 hover:text-text transition-colors">Marketplace</Link>
              <Link href="/dashboard" className="type-caption text-text-3 hover:text-text transition-colors">Dashboard</Link>
              <span className="w-px h-3.5 bg-border" />
              <span className="type-caption text-text-3">Fuji</span>
            </nav>
          </div>
        </header>
        <main className="flex-1 pt-14">{children}</main>
      </body>
    </html>
  );
}
