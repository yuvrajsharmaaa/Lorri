/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/components/sidebar/upgrade.tsx
"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    try {
      // Check if checkout method exists
      if (!authClient.checkout) {
        console.error("Polar checkout not available - plugin not loaded");
        alert("Upgrade feature not available. Please ensure Polar is configured.");
        return;
      }

      await authClient.checkout({
        products: [
          "634c916c-7adf-417b-8e46-e840063d2f4a", // Your Premium product ID
        ],
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again or contact support.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 cursor-pointer text-orange-400"
      onClick={upgrade}
    >
      Upgrade to Premium
    </Button>
  );
}
