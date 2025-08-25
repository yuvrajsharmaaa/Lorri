// src/components/customer-portal-redirect.tsx
"use client";

import { Button } from "~/components/ui/button";

export default function CustomerPortalRedirect() {
  const handlePortal = () => {
    // Redirect to your own account management
    window.location.href = "/account";
  };

  return <Button onClick={handlePortal}>Manage Account</Button>;
}
