/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */

"use client";

import type { Category, Like, Song } from "@prisma/client";
import { Heart, Loader2, Music, Play, DollarSign } from "lucide-react";
import { useState } from "react";
import { getPlayUrl } from "~/actions/generation";
import { toggleLikeSong } from "~/actions/song";
import { usePlayerStore } from "~/stores/use-player-store";
import { BuyMusicDialog } from "~/components/payment/buy-music-dialog";
import { SellSongDialog } from "~/components/payment/sell-song-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useSession } from "~/lib/auth-client";

type SongWithRelation = Song & {
  user: { 
    name: string | null;
    walletAddress?: string | null;
  };
  _count: {
    likes: number;
  };
  categories: Category[];
  thumbnailUrl?: string | null;
  likes?: Like[];
};

export function SongCard({ song }: { song: SongWithRelation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(
    song.likes ? song.likes.length > 0 : false,
  );
  const [likesCount, setLikesCount] = useState(song._count.likes);
  const { data: session } = useSession();
  const isOwner = session?.user?.id === song.userId;

  const handlePlay = async () => {
    setIsLoading(true);
    const playUrl = await getPlayUrl(song.id);

    const { setTrack } = usePlayerStore();
    setTrack({
      id: song.id,
      title: song.title,
      url: playUrl,
      artwork: song.thumbnailUrl,
      prompt: song.prompt,
      createdByUserName: song.user.name,
    });

    setIsLoading(false);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    await toggleLikeSong(song.id);
  };

  return (
    <div>
      <div className="relative">
        <div onClick={handlePlay} className="cursor-pointer">
          <div className="group relative aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
            {song.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="h-full w-full object-cover object-center"
                src={song.thumbnailUrl}
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <Music className="text-muted-foreground h-12 w-12" />
              </div>
            )}

            {/* Loader */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 transition-transform group-hover:scale-105">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Play className="h-6 w-6 fill-white text-white" />
                )}
              </div>
            </div>

            {/* Sale Badge */}
            {song.isForSale && song.price && song.price > 0 && (
              <div className="absolute top-2 left-2">
                <Badge variant="default" className="bg-green-600 text-white">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {song.price} SOL
                </Badge>
              </div>
            )}
          </div>

          <h3 className="mt-2 truncate text-sm font-medium text-gray-900">
            {song.title}
          </h3>

          <p className="text-xs text-gray-500">{song.user.name}</p>

          <div className="mt-1 flex items-center justify-between text-xs text-gray-900">
            <span>{song.listenCount} listens</span>
            <button
              onClick={handleLike}
              className="flex cursor-pointer items-center gap-1"
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              {likesCount} likes
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex gap-2">
          {song.isForSale && song.price && song.price > 0 && !isOwner && (
            <BuyMusicDialog
              song={{
                id: song.id,
                title: song.title,
                price: song.price,
                user: {
                  name: song.user.name || "",
                  walletAddress: song.user.walletAddress || undefined,
                },
                s3Key: song.s3Key || undefined,
                thumbnailS3Key: song.thumbnailS3Key || undefined,
              }}
              trigger={
                <Button size="sm" className="flex-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Buy {song.price} SOL
                </Button>
              }
            />
          )}

          {isOwner && (
            <SellSongDialog
              song={{
                id: song.id,
                title: song.title,
                user: {
                  name: song.user.name || "",
                  walletAddress: song.user.walletAddress || undefined,
                },
                price: song.price || undefined,
                isForSale: song.isForSale || false,
              }}
              trigger={
                <Button variant="outline" size="sm" className="flex-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {song.isForSale ? "Update Sale" : "Sell"}
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
