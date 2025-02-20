"use server";

import prisma from "@/lib/db";
import { newBlogSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { getServerSession } from 'next-auth';


export async function publishNewBlogPost(data: { title: string; content: string }) {
  const session = await getServerSession();
  const email = session?.user?.email;

  try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
  });
      if (!user) {
        return { message: 'User not found' };
      }
      const validatedData = newBlogSchema.parse(data);
      await prisma.post.create({
        data: { 
          title: validatedData.title,
          content: validatedData.content,
          authorId: user.id,
          published: true
        }
      });

      revalidatePath('/feed'); 

  } catch (error) {
      console.error("Error publishing post:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to publish blog post" };
  }
}