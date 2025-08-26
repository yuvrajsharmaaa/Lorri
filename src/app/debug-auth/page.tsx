import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { headers } from "next/headers";

export default async function DebugAuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get all users from database
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      sessions: {
        select: {
          id: true,
          expiresAt: true,
          createdAt: true,
        },
      },
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Current Session</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Database Users ({users.length})</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="border p-3 rounded bg-white">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</div>
                <div><strong>Created:</strong> {user.createdAt.toISOString()}</div>
                <div><strong>Active Sessions:</strong> {user.sessions.length}</div>
                {user.sessions.length > 0 && (
                  <div className="mt-2">
                    <strong>Sessions:</strong>
                    <ul className="ml-4">
                      {user.sessions.map((session) => (
                        <li key={session.id}>
                          {session.id} - Expires: {session.expiresAt.toISOString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Check</h2>
          <div>
            <div><strong>BETTER_AUTH_SECRET:</strong> {process.env.BETTER_AUTH_SECRET ? 'Set' : 'Not Set'}</div>
            <div><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? 'Set' : 'Not Set'}</div>
            <div><strong>NEXT_PUBLIC_BASE_URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || 'Not Set'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
