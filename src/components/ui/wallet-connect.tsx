"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "./button";
import { Wallet, WalletOff } from "lucide-react";

export function WalletConnect() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
            </span>
          </div>
          <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <WalletOff className="h-4 w-4" />
            <span className="hidden sm:inline">Wallet not connected</span>
          </div>
          <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
        </div>
      )}
    </div>
  );
}
