"use client";

import { useSidebar } from "@/components/sidebar-context";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="relative min-h-dvh bg-bg">
      <Sidebar />
      <div
        className={`relative min-w-0 transition-[padding] duration-200 ease-out ${
          collapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <main className="relative min-w-0 px-6 py-8 sm:px-8 lg:px-10 lg:pt-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
