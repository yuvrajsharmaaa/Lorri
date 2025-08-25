/* eslint-disable @typescript-eslint/no-unsafe-assignment */
 
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js"; // Optional plugin
import { prismaAdapter } from "better-auth/adapters/prisma"; // If using Prisma
import { db } from "~/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  plugins: [ nextCookies() ], // Optional, if using server actions in Next.js
  // other config like appName, baseURL, etc.
});
