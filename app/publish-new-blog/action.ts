"use server";

import prisma from "@/lib/db";
import { newBlogSchema } from "@/lib/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function publishNewBlogPost(data: { title: string; content: string }) {

  try {
  
    const validatedData = newBlogSchema.parse(data);

    const post = await prisma.post.create({
      data: { 
        title: validatedData.title,
        content: validatedData.content,
        authorId: "cm74m661u0000v064mragf7ry",
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