"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Music, Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { solanaService } from "~/lib/solana";
import { toast } from "sonner";

interface BuyMusicDialogProps {
  song: {
    id: string;
    title: string;
    price: number;
    user: {
      name: string;
      walletAddress?: string;
    };
    s3Key?: string;
    thumbnailS3Key?: string;
  };
  trigger?: React.ReactNode;
}

export function BuyMusicDialog({ song, trigger }: BuyMusicDialogProps) {
  const { connected, publicKey, sendTransaction } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "success" | "error" | null>(null);

  const handlePurchase = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!song.user.walletAddress) {
      toast.error("Seller wallet address not found");
      return;
    }

    setIsProcessing(true);
    setTransactionStatus("pending");

    try {
      // Create payment transaction
      const transaction = await solanaService.createPaymentTransaction(
        publicKey.toString(),
        song.user.walletAddress,
        song.price
      );

      // Get recent blockhash
      const connection = solanaService.getConnection();
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      // Record purchase in database
      await recordPurchase(signature);
      
      setTransactionStatus("success");
      toast.success("Purchase successful! You now own this music.");
      
      // Close dialog after a delay
      setTimeout(() => {
        setIsOpen(false);
        setTransactionStatus(null);
      }, 2000);

    } catch (error) {
      console.error("Purchase error:", error);
      setTransactionStatus("error");
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const recordPurchase = async (transactionHash: string) => {
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songId: song.id,
          amount: song.price,
          transactionHash,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record purchase");
      }
    } catch (error) {
      console.error("Error recording purchase:", error);
    }
  };

  const getStatusIcon = () => {
    switch (transactionStatus) {
      case "pending":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (transactionStatus) {
      case "pending":
        return "Processing transaction...";
      case "success":
        return "Purchase successful!";
      case "error":
        return "Transaction failed";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Music className="h-4 w-4 mr-2" />
            Buy for {song.price} SOL
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Music</DialogTitle>
          <DialogDescription>
            Complete your purchase using your Solana wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Song Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{song.title}</CardTitle>
              <CardDescription>by {song.user.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {song.price} SOL
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Wallet Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Wallet Status</span>
            </div>
            <Badge variant={connected ? "default" : "destructive"}>
              {connected ? "Connected" : "Not Connected"}
            </Badge>
          </div>

          {/* Transaction Status */}
          {transactionStatus && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              {getStatusIcon()}
              <span className="text-sm">{getStatusText()}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!connected || isProcessing}
            className="flex-1 sm:flex-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Music className="h-4 w-4 mr-2" />
                Purchase for {song.price} SOL
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
