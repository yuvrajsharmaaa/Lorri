/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CustomerPortalRedirect from "~/components/customer-portal-redirect";
import { auth } from "~/lib/auth";

export default async function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <CustomerPortalRedirect />;
}
