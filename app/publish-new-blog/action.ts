"use server";

import prisma from "@/lib/db";
import { newBlogSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { getServerSession } from 'next-auth';

export async function publishNewBlogPost(data: { title: string; content: string, slug: string }) {
  const session = await getServerSession();
  const email = session?.user?.email;

  try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return { error: 'User not found', status: 404 };
      }

      const validatedData = newBlogSchema.parse(data);
      
      await prisma.post.create({
        data: { 
          title: validatedData.title,
          content: validatedData.content,
          slug: validatedData.slug,
          authorId: user.id,
          published: true
        }
      });

      // Make sure we're in a context where revalidatePath works
      try {
        revalidatePath('/feed');
      } catch (error) {
        console.error("Error revalidating path:", error);
        // The page will still refresh when navigated to due to dynamic rendering
      }

      return { message: 'Post published successfully' };
  } catch (error) {
      console.error("Error publishing post:", error);
    if (error instanceof Error) {
      return { error: error.message, status: 400 };
    }
    return { error: "Failed to publish blog post", status: 500 };
  }
}