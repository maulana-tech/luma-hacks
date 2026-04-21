"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Settings,
  Clock,
  Wallet,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavSection = { title: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/marketplace", label: "Marketplace", icon: Store },
    ],
  },
  {
    title: "PayAgent",
    items: [
      { href: "/dashboard?tab=rules", label: "Spend Rules", icon: Settings },
      { href: "/dashboard?tab=escrow", label: "Escrow", icon: Wallet },
      { href: "/dashboard?tab=history", label: "History", icon: Clock },
    ],
  },
];

export default function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out lg:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <Suspense fallback={<div className="flex-1" />}>
        <SidebarContent />
      </Suspense>
    </aside>
  );
}

function SidebarContent() {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-14 items-center ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {collapsed ? (
          <button
            onClick={toggle}
            aria-label="Expand sidebar"
            className="flex h-9 w-9 items-center justify-center border border-border bg-bg text-text-2 transition-colors hover:border-accent hover:bg-accent hover:text-bg"
          >
            <PanelLeftOpen className="h-4 w-4" strokeWidth={1.8} />
          </button>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <span className="text-bg font-bold text-[10px]">A</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight">
                Vaxa
              </span>
            </Link>
            <button
              onClick={toggle}
              aria-label="Collapse sidebar"
              className="shrink-0 p-1 text-text-3 transition-colors hover:text-text"
            >
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? "py-2" : "py-4"}`}>
        {navSections.map((section, i) => (
          <SidebarSection
            key={section.title}
            section={section}
            collapsed={collapsed}
            isFirst={i === 0}
          />
        ))}
      </nav>

      <div className={`space-y-2 py-4 ${collapsed ? "px-2" : "px-4"}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="type-caption text-text-3">Network</div>
                <div className="mt-0.5 text-[13px] text-text-2 font-medium">
                  Avalanche Fuji
                </div>
                <div className="text-[11px] text-text-3 font-mono">
                  Chain 43113 · USDC
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Wallet size={14} className="text-text-3" strokeWidth={1.5} />
            <span className="text-[10px] text-text-3">Fuji</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarSection({
  section,
  collapsed,
  isFirst,
}: {
  section: NavSection;
  collapsed: boolean;
  isFirst: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className={`${collapsed ? "mb-2" : "mb-5"} ${isFirst ? "mt-0" : ""}`}>
      {!collapsed && (
        <h3 className="type-caption mb-1.5 px-4 text-text-3">
          {section.title}
        </h3>
      )}
      <ul className={collapsed ? "flex flex-col gap-1" : ""}>
        {section.items.map((item) => {
          const [itemPath, itemQuery] = item.href.split("?");
          const itemTab = new URLSearchParams(itemQuery || "").get("tab");
          const currentTab = searchParams.get("tab");
          const isActive = pathname === itemPath && (
            !itemTab
              ? !currentTab || currentTab === "overview"
              : currentTab === itemTab
          );
          return (
            <li
              key={item.href}
              className={`relative ${collapsed ? "mx-auto h-9 w-9" : ""}`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-accent rounded-lg"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                  }}
                />
              )}
              <Link
                href={item.href}
                className={`relative flex items-center text-[13px] transition-colors ${
                  collapsed
                    ? "h-full w-full justify-center"
                    : "gap-3 px-4 py-2.5 rounded-lg"
                } ${
                  isActive
                    ? "font-medium text-bg"
                    : "text-text-3 hover:text-text"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
