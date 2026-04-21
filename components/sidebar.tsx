"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Settings,
  Clock,
  Wallet,
  Shield,
  Menu,
  X,
  FileText,
  type LucideIcon,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavSection = { title: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/marketplace", label: "Marketplace", icon: Store },
      { href: "/whitepaper", label: "Whitepaper", icon: FileText },
    ],
  },
  {
    title: "PayAgent",
    items: [
      { href: "/dashboard?tab=rules", label: "Spend Rules", icon: Settings },
      { href: "/dashboard?tab=escrow", label: "Escrow", icon: Shield },
      { href: "/dashboard?tab=history", label: "History", icon: Clock },
    ],
  },
  {
    title: "Wallet",
    items: [
      { href: "/verify", label: "Verify Wallet", icon: Wallet },
    ],
  },
];

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-9 h-9 border border-border bg-surface text-text-2 hover:border-border-strong hover:text-text transition-colors"
      aria-label="Open menu"
    >
      <Menu size={18} strokeWidth={1.8} />
    </button>
  );
}

function SidebarNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 h-14 border-b border-border">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-6 h-6 bg-accent flex items-center justify-center">
            <span className="text-bg font-bold text-[10px]">A</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-text">Vaxa</span>
        </Link>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 text-text-3 hover:text-text transition-colors"
          aria-label="Close menu"
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section, i) => (
          <div key={section.title} className={i > 0 ? "mt-6" : ""}>
            <h3 className="text-[10px] font-semibold tracking-[1px] uppercase text-text-3 px-5 mb-2">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const [itemPath, itemQuery] = item.href.split("?");
                const itemTab = itemQuery ? new URLSearchParams(itemQuery).get("tab") : null;
                const currentTab = searchParams.get("tab");
                const isActive = pathname === itemPath && (
                  !itemTab
                    ? !currentTab || currentTab === "overview"
                    : currentTab === itemTab
                );

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors ${
                        isActive
                          ? "bg-accent text-bg font-medium"
                          : "text-text-3 hover:text-text hover:bg-surface-hover"
                      }`}
                    >
                      <item.icon size={16} strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <div className="text-[10px] text-text-3 uppercase tracking-[1px] mb-1">Network</div>
        <div className="text-[13px] text-text-2 font-medium">Avalanche Fuji</div>
        <div className="text-[11px] text-text-3 font-mono">Chain 43113 · USDC</div>
        <div className="mt-3">
          <a
            href="https://t.me/vaixa_bot"
            target="_blank"
            className="flex items-center gap-2 text-[12px] text-accent hover:underline"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            @vaixa_bot
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SidebarToggle onClick={() => setOpen(true)} />

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-surface border-r border-border shadow-xl">
            <Suspense fallback={<div className="flex-1" />}>
              <SidebarNav onClose={() => setOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
