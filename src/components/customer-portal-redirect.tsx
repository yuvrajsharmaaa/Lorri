// src/components/customer-portal-redirect.tsx
"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useRouter } from "next/navigation";

export default function CustomerPortalRedirect() {
  const router = useRouter();

  const handlePortal = () => {
    // Redirect to the main page for now
    router.push("/");
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Customer Portal</CardTitle>
          <CardDescription>
            Manage your account and subscription settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handlePortal} className="w-full">
            Go to Dashboard
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Customer portal functionality coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
