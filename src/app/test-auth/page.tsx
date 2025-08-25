import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";

export default async function TestAuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="space-y-2">
        <p><strong>User ID:</strong> {session.user.id}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Name:</strong> {session.user.name}</p>
      </div>
      <div className="mt-4">
        <a href="/" className="text-blue-500 hover:underline">Go to Home</a>
      </div>
    </div>
  );
}
