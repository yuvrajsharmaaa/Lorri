/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { env } from "~/env";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,                    // ✅ Enable email/password auth
    requireEmailVerification: false, // Set to true later if you want email verification
    autoSignIn: true,                 // Auto sign-in after successful registration
    minPasswordLength: 8,             // Minimum password length
    maxPasswordLength: 128,           // Maximum password length
    disableSignUp: false,             // Allow new user registrations
  },
  plugins: [], // No Polar integration - clean setup
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
