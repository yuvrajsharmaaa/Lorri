import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { env } from "~/env";

export default async function DebugPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get some basic stats
  const userCount = await db.user.count();
  const songCount = await db.song.count();
  const processedSongs = await db.song.count({
    where: { status: "processed" }
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Authentication</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Session:</strong> {session ? "Active" : "None"}</p>
            {session && (
              <>
                <p><strong>User ID:</strong> {session.user.id}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
              </>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Database Stats</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Total Users:</strong> {userCount}</p>
            <p><strong>Total Songs:</strong> {songCount}</p>
            <p><strong>Processed Songs:</strong> {processedSongs}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-1 text-sm">
            <p><strong>NODE_ENV:</strong> {env.NODE_ENV}</p>
            <p><strong>Modal Key:</strong> {env.MODAL_KEY ? "Set" : "Not Set"}</p>
            <p><strong>Modal Secret:</strong> {env.MODAL_SECRET ? "Set" : "Not Set"}</p>
            <p><strong>AWS Access Key:</strong> {env.AWS_ACCESS_KEY_ID ? "Set" : "Not Set"}</p>
            <p><strong>S3 Bucket:</strong> {env.S3_BUCKET_NAME || "Not Set"}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">API Endpoints</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Generate from Description:</strong> {env.GENERATE_FROM_DESCRIPTION ? "Set" : "Not Set"}</p>
            <p><strong>Generate with Lyrics:</strong> {env.GENERATE_WITH_LYRICS ? "Set" : "Not Set"}</p>
            <p><strong>Generate from Described Lyrics:</strong> {env.GENERATE_FROM_DESCRIBED_LYRICS ? "Set" : "Not Set"}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="space-x-2">
          <a href="/auth/sign-in" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In
          </a>
          <a href="/auth/sign-up" className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Sign Up
          </a>
          <a href="/create" className="inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Create Song
          </a>
          <a href="/" className="inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
