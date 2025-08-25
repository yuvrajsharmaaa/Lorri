// src/components/sidebar/upgrade.tsx
"use client";

import { Button } from "../ui/button";

export default function Upgrade() {
  const handleUpgrade = () => {
    // Option 1: Direct external payment link
    window.open("https://buy.stripe.com/your-payment-link", "_blank");

    // Option 2: Your own checkout page
    // window.open("/checkout", "_blank");

    // Option 3: Simple contact form
    // window.open("mailto:contact@lorri.com?subject=Premium Subscription", "_blank");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 cursor-pointer text-orange-400"
      onClick={handleUpgrade}
    >
      Upgrade to Premium
    </Button>
  );
}
