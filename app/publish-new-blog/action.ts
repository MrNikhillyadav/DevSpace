"use server";

import prisma from "@/lib/db";
import { newBlogSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";


export async function publishNewBlogPost(data: { title: string; content: string }) {

  try {
  
    const validatedData = newBlogSchema.parse(data);

    const post = await prisma.post.create({
      data: { 
        title: validatedData.title,
        content: validatedData.content,
        authorId: "cm7ae0rbf0006v0g8cu1u02wx",
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