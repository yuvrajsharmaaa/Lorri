"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Music, Wallet, DollarSign, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SellSongDialogProps {
  song: {
    id: string;
    title: string;
    user: {
      name: string;
      walletAddress?: string;
    };
    price?: number;
    isForSale?: boolean;
  };
  trigger?: React.ReactNode;
  onUpdate?: () => void;
}

export function SellSongDialog({ song, trigger, onUpdate }: SellSongDialogProps) {
  const { connected, publicKey } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(song.price?.toString() || "");
  const [isForSale, setIsForSale] = useState(song.isForSale || false);

  const handleSubmit = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/songs/${song.id}/sale`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: priceValue,
          isForSale: isForSale,
          walletAddress: publicKey.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update song sale status");
      }

      toast.success(
        isForSale 
          ? `Song listed for sale at ${priceValue} SOL` 
          : "Song removed from sale"
      );
      
      setIsOpen(false);
      onUpdate?.();

    } catch (error) {
      console.error("Error updating song sale status:", error);
      toast.error("Failed to update song sale status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFromSale = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/songs/${song.id}/sale`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isForSale: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove song from sale");
      }

      setIsForSale(false);
      toast.success("Song removed from sale");
      onUpdate?.();

    } catch (error) {
      console.error("Error removing song from sale:", error);
      toast.error("Failed to remove song from sale");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            {isForSale ? "Update Sale" : "Put for Sale"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isForSale ? "Update Sale Price" : "Put Song for Sale"}
          </DialogTitle>
          <DialogDescription>
            Set a price for your music and start earning from sales
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
              {isForSale && song.price && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    {song.price} SOL
                  </Badge>
                </div>
              )}
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

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (SOL)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.1"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Set a price in SOL for your music. You'll receive 95% of the sale price.
            </p>
          </div>

          {/* Sale Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="text-sm">Sale Status</span>
            </div>
            <Badge variant={isForSale ? "default" : "secondary"}>
              {isForSale ? "For Sale" : "Not for Sale"}
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          
          {isForSale && (
            <Button
              variant="destructive"
              onClick={handleRemoveFromSale}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove from Sale"
              )}
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={!connected || isProcessing || !price}
            className="flex-1 sm:flex-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                {isForSale ? "Update Price" : "Put for Sale"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
