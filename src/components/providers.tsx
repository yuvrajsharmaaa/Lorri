 
/* eslint-disable @typescript-eslint/unbound-method */
"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "../lib/auth-client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { env } from "~/env";

// Import wallet adapter CSS
require("@solana/wallet-adapter-react-ui/styles.css");

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Solana network configuration
  const network = env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;
  const endpoint = env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network);

  // Initialize wallet adapters
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => {
              // Clear router cache (protected routes)
              router.refresh();
            }}
            Link={Link}
          >
            {children}
          </AuthUIProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
