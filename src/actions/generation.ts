/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
 
 
 
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inngest } from "~/inngest/client";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface GenerateRequest {
  prompt?: string;
  lyrics?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  instrumental?: boolean;
}

export async function generateSong(generateRequest: GenerateRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  

  if (!session) redirect("/auth/sign-in");
  const user = session.user as { id: string; email?: string | null; name?: string | null };

  console.log("Starting song generation for user:", user.id);
  console.log("Generate request:", generateRequest);

  try {
    await queueSong(generateRequest, 7.5, session.user.id);
    await queueSong(generateRequest, 15, session.user.id);
    
    console.log("Successfully queued songs for generation");
    revalidatePath("/create");
  } catch (error) {
    console.error("Error in generateSong:", error);
    throw new Error("Failed to queue song generation");
  }
}

export async function queueSong(
  generateRequest: GenerateRequest,
  guidanceScale: number,
  userId: string,
) {
  let title = "Untitled";
  if (generateRequest.describedLyrics) title = generateRequest.describedLyrics;
  if (generateRequest.fullDescribedSong)
    title = generateRequest.fullDescribedSong;

  title = title.charAt(0).toUpperCase() + title.slice(1);

  console.log("Creating song in database:", { title, userId, guidanceScale });

  const song = await db.song.create({
    data: {
      userId: userId,
      title: title,
      prompt: generateRequest.prompt,
      lyrics: generateRequest.lyrics,
      describedLyrics: generateRequest.describedLyrics,
      fullDescribedSong: generateRequest.fullDescribedSong,
      instrumental: generateRequest.instrumental,
      guidanceScale: guidanceScale,
      audioDuration: 180,
    },
  });

  console.log("Song created with ID:", song.id);

  try {
    await inngest.send({
      name: "generate-song-event",
      data: { songId: song.id, userId: song.userId },
    });
    console.log("Inngest event sent successfully for song:", song.id);
  } catch (error) {
    console.error("Failed to send inngest event:", error);
    throw error;
  }
}

export async function getPlayUrl(songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const song = await db.song.findUniqueOrThrow({
    where: {
      id: songId,
      OR: [{ userId: session.user.id }, { published: true }],
      s3Key: {
        not: null,
      },
    },
    select: {
      s3Key: true,
    },
  });

  await db.song.update({
    where: { id: songId },
    data: { listenCount: { increment: 1 } },
  });

  if (!song.s3Key) {
    throw new Error("Song has no S3 key yet.");
  }

  return await getPresignedUrl(song.s3Key);
}

export async function getPresignedUrl(key: string) {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are missing.");
  }

  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
}
