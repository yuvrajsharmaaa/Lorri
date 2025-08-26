import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { getPresignedUrl } from "~/actions/generation";
import { SongCard } from "~/components/home/song-card";
import { BuyMusicDialog } from "~/components/payment/buy-music-dialog";
import { WalletConnect } from "~/components/ui/wallet-connect";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Music, TrendingUp, DollarSign, Users } from "lucide-react";

export default async function MarketplacePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Get songs for sale
  const songsForSale = await db.song.findMany({
    where: {
      published: true,
      isForSale: true,
      price: {
        gt: 0,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          walletAddress: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      categories: true,
      likes: session.user.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get user's purchased songs
  const userPurchases = await db.purchase.findMany({
    where: {
      buyerId: session.user.id,
      status: "completed",
    },
    include: {
      song: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
          categories: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get user's sold songs
  const userSales = await db.purchase.findMany({
    where: {
      sellerId: session.user.id,
      status: "completed",
    },
    include: {
      song: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      buyer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Add presigned URLs to songs
  const songsWithUrls = await Promise.all(
    songsForSale.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;

      return { ...song, thumbnailUrl };
    })
  );

  const purchasedSongsWithUrls = await Promise.all(
    userPurchases.map(async (purchase) => {
      const thumbnailUrl = purchase.song.thumbnailS3Key
        ? await getPresignedUrl(purchase.song.thumbnailS3Key)
        : null;

      return { ...purchase, song: { ...purchase.song, thumbnailUrl } };
    })
  );

  // Calculate total earnings
  const totalEarnings = userSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Music Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell unique music tracks with Solana
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toFixed(4)} SOL</div>
            <p className="text-xs text-muted-foreground">
              {userPurchases.length} purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toFixed(4)} SOL</div>
            <p className="text-xs text-muted-foreground">
              {userSales.length} sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Songs</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{songsForSale.length}</div>
            <p className="text-xs text-muted-foreground">
              Songs for sale
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
          <TabsTrigger value="purchased">My Purchases</TabsTrigger>
          <TabsTrigger value="sales">My Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Songs for Sale</h2>
            <Badge variant="secondary">
              {songsForSale.length} songs available
            </Badge>
          </div>

          {songsForSale.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Music className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No songs for sale</h3>
                <p className="text-muted-foreground text-center">
                  Check back later for new music releases
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {songsWithUrls.map((song) => (
                <div key={song.id} className="relative group">
                  <SongCard song={song} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <BuyMusicDialog
                      song={{
                        id: song.id,
                        title: song.title,
                        price: song.price || 0,
                        user: {
                          name: song.user.name,
                          walletAddress: song.user.walletAddress || undefined,
                        },
                        s3Key: song.s3Key || undefined,
                        thumbnailS3Key: song.thumbnailS3Key || undefined,
                      }}
                      trigger={
                        <Button size="sm" className="bg-primary text-primary-foreground">
                          <Music className="h-4 w-4 mr-2" />
                          Buy for {song.price} SOL
                        </Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Purchases</h2>
            <Badge variant="secondary">
              {userPurchases.length} songs owned
            </Badge>
          </div>

          {userPurchases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Music className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground text-center">
                  Start exploring the marketplace to buy your first song
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {purchasedSongsWithUrls.map((purchase) => (
                <div key={purchase.id} className="relative">
                  <SongCard song={purchase.song} />
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs">
                      Owned
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Sales</h2>
            <Badge variant="secondary">
              {userSales.length} songs sold
            </Badge>
          </div>

          {userSales.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sales yet</h3>
                <p className="text-muted-foreground text-center">
                  Put your songs up for sale to start earning
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userSales.map((sale) => (
                <Card key={sale.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{sale.song.title}</CardTitle>
                    <CardDescription>
                      Sold to {sale.buyer.name} for {sale.amount} SOL
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Transaction: {sale.transactionHash?.slice(0, 8)}...
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
