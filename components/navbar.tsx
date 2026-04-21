"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Sidebar from "@/components/sidebar";

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {!isLanding && <Sidebar />}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent flex items-center justify-center">
              <span className="text-bg font-bold text-[10px]">A</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Vaxa</span>
          </Link>
        </div>
        <nav className="flex items-center gap-5">
          <Link href="/marketplace" className="type-caption text-text-3 hover:text-text transition-colors">
            Marketplace
          </Link>
          <Link
            href="/dashboard"
            className="type-caption text-text-3 hover:text-text transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/whitepaper"
            className="type-caption text-text-3 hover:text-text transition-colors"
          >
            Whitepaper
          </Link>
          <a
            href="https://t.me/vaixa_bot"
            target="_blank"
            className="type-caption text-text-3 hover:text-text transition-colors flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Bot
          </a>
          <span className="w-px h-3.5 bg-border" />
          <span className="type-caption text-text-3">Fuji</span>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <div
                  {...(!mounted && {
                    "aria-hidden": true,
                    style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="h-8 px-4 bg-accent text-bg text-[12px] font-medium hover:bg-accent-hover transition-colors"
                        >
                          Connect Wallet
                        </button>
                      );
                    }
                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="h-8 px-3 border border-red bg-red/10 text-red text-[12px] font-medium hover:bg-red/20 transition-colors"
                        >
                          Wrong network
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-2 h-8 px-3 border border-border bg-surface text-[12px] font-medium text-text-2 hover:border-border-strong hover:text-text transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="font-mono">{account.displayName}</span>
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </nav>
      </div>
    </header>
  );
}
