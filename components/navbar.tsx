"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto h-14 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent flex items-center justify-center">
            <span className="text-bg font-bold text-[10px]">A</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Vaxa</span>
        </Link>
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
