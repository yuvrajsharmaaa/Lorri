/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/app/(auth)/auth/[path]/page.tsx
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { AuthCard } from "@daveyplate/better-auth-ui"; // ✅ Use AuthCard instead

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
      <AuthCard view={path as any} />
    </main>
  );
}
