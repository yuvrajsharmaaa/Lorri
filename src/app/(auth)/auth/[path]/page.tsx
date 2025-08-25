import { authViewPaths } from "@daveyplate/better-auth-ui";
import { AuthView } from "./view";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path })); // Use 'path', not 'pathname'
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>; // Use 'path', not 'pathname'
}) {
  const { path } = await params; // Use 'path', not 'pathname'

  return <AuthView pathname={path} />; // Pass path as pathname prop
}
