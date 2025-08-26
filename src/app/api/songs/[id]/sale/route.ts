import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { headers } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { price, isForSale, walletAddress } = await request.json();

    // Get the song and verify ownership
    const song = await db.song.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    if (song.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own songs" },
        { status: 403 }
      );
    }

    // Update song sale status
    const updatedSong = await db.song.update({
      where: { id: params.id },
      data: {
        price: price !== undefined ? price : song.price,
        isForSale: isForSale !== undefined ? isForSale : song.isForSale,
      },
      include: {
        user: true,
      },
    });

    // Update user's wallet address if provided
    if (walletAddress) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          walletAddress,
        },
      });
    }

    return NextResponse.json({ song: updatedSong });
  } catch (error) {
    console.error("Update song sale error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
