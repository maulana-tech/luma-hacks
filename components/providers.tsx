"use client";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { avalancheFuji, avalanche } from "wagmi/chains";
import { http } from "wagmi";

import { SidebarProvider } from "./sidebar-context";

import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "Vaxa",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [avalancheFuji, avalanche],
  transports: {
    [avalancheFuji.id]: http("https://api.avax-test.network/ext/bc/C/rpc"),
    [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
  },
  ssr: true,
  multiInjectedProviderDiscovery: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
