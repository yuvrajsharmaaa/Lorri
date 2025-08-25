// src/app/(auth)/auth/[path]/page.tsx
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { AuthView } from "@daveyplate/better-auth-ui"; // ✅ Import component from main package

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
      <AuthView path={path} />
    </main>
  );
}
