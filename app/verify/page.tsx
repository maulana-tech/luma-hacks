"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Copy, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

function buildVerificationMessage(address: string, nonce: string, telegramId: string): string {
  return `Sign this message to verify you own this wallet for Vaxa Telegram Bot.\n\nWallet: ${address}\nTelegram ID: ${telegramId}\nNonce: ${nonce}\n\nThis signature is valid for 10 minutes.`;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);

  const address = searchParams.get("address") || "";
  const tid = searchParams.get("tid") || "";
  const nonce = searchParams.get("nonce") || "";

  const message = address && tid && nonce
    ? buildVerificationMessage(address, nonce, tid)
    : "";

  const hasParams = !!(address && tid && nonce);

  useEffect(() => {
    if (!hasParams) return;
  }, [hasParams]);

  async function handleSign() {
    if (!message) return;
    setError("");
    setSigning(true);
    try {
      const sig = await signMessageAsync({ message });
      setSignature(sig);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Signing cancelled or failed.");
    } finally {
      setSigning(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-surface-muted">
      <div className="max-w-xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="text-[13px] text-accent hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-[28px] font-bold tracking-tight text-text mb-2">
          Verify Wallet
        </h1>
        <p className="text-[15px] text-text-2 mb-8">
          Sign a message to link your wallet with the Telegram bot.
        </p>

        {!hasParams ? (
          <div className="bg-surface border border-border p-6">
            <p className="text-[14px] text-text-2 mb-3">
              This page should be opened from the Telegram bot link.
            </p>
            <p className="text-[13px] text-text-3">
              Send <code className="text-accent">/connect 0xYourAddress</code> in Telegram to get the verification link.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-surface border border-border p-5">
              <label className="text-[13px] font-semibold text-text mb-2 block">
                Message to sign
              </label>
              <div className="bg-bg border border-border p-3">
                <pre className="text-[12px] text-text-2 font-mono whitespace-pre-wrap break-all leading-relaxed">{message}</pre>
              </div>
            </div>

            <div className="bg-surface border border-border p-5">
              <label className="text-[13px] font-semibold text-text mb-3 block">
                Connect wallet & sign
              </label>
              {!isConnected ? (
                <div className="flex items-center gap-4">
                  <ConnectButton.Custom>
                    {({ openConnectModal, mounted }) => (
                      <div
                        {...(!mounted && {
                          "aria-hidden": true,
                          style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                        })}
                      >
                        <button
                          onClick={openConnectModal}
                          className="h-10 px-6 bg-accent text-bg text-[14px] font-medium hover:bg-accent-hover transition-colors"
                        >
                          Connect Wallet
                        </button>
                      </div>
                    )}
                  </ConnectButton.Custom>
                </div>
              ) : (
                <button
                  onClick={handleSign}
                  disabled={signing}
                  className="h-10 px-6 bg-accent text-bg text-[14px] font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {signing ? "Waiting for signature..." : "Sign Message"}
                </button>
              )}
              {error && (
                <div className="flex items-center gap-2 mt-3 text-[13px] text-red">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            {signature && (
              <div className="bg-surface border border-accent/30 p-5">
                <label className="text-[13px] font-semibold text-accent mb-2 block">
                  Copy this signature and send to Telegram bot:
                </label>
                <div className="bg-bg border border-border p-3 relative">
                  <code className="text-[12px] text-text font-mono break-all leading-relaxed">
                    {signature}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 text-text-3 hover:text-text p-1"
                  >
                    {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-[12px] text-text-3 mt-3">
                  Send: <code className="text-accent">/verify {signature.slice(0, 20)}...</code> to the bot
                </p>
              </div>
            )}

            <div className="bg-bg border border-border p-4 text-[13px] text-text-3 leading-relaxed">
              <strong className="text-text">How it works:</strong>
              <ol className="mt-2 space-y-1.5 list-decimal pl-4">
                <li>In Telegram, send <code className="text-accent">/connect 0xYourAddress</code></li>
                <li>Click the link the bot replies with</li>
                <li>Connect wallet & sign the message</li>
                <li>Copy the signature and send <code className="text-accent">/verify &lt;signature&gt;</code> in Telegram</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center text-text-3">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
