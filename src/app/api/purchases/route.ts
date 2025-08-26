import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songId, amount, transactionHash } = await request.json();

    if (!songId || !amount || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get song details
    const song = await db.song.findUnique({
      where: { id: songId },
      include: { user: true },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    if (!song.isForSale) {
      return NextResponse.json(
        { error: "Song is not for sale" },
        { status: 400 }
      );
    }

    // Check if user already purchased this song
    const existingPurchase = await db.purchase.findFirst({
      where: {
        songId,
        buyerId: session.user.id,
        status: "completed",
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "You already own this song" },
        { status: 400 }
      );
    }

    // Create purchase record
    const purchase = await db.purchase.create({
      data: {
        songId,
        buyerId: session.user.id,
        sellerId: song.userId,
        amount,
        transactionHash,
        status: "completed",
      },
      include: {
        song: {
          include: {
            user: true,
          },
        },
        buyer: true,
      },
    });

    return NextResponse.json({ purchase });
  } catch (error) {
    console.error("Purchase API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "bought" or "sold"

    let purchases;

    if (type === "sold") {
      // Get songs sold by the user
      purchases = await db.purchase.findMany({
        where: {
          sellerId: session.user.id,
          status: "completed",
        },
        include: {
          song: {
            include: {
              user: true,
            },
          },
          buyer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Get songs bought by the user
      purchases = await db.purchase.findMany({
        where: {
          buyerId: session.user.id,
          status: "completed",
        },
        include: {
          song: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Get purchases API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
