// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
});

// Export the methods you'll use
export const { 
  signUp, 
  signIn, 
  signOut, 
  useSession 
} = authClient;
