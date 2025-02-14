"use server";

import prisma from "@/lib/db";
import { newBlogSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export  async function publishNewBlogPost(formData: FormData) {
  const {title,content} = newBlogSchema.parse(formData)
  
  await prisma.post.create({
    data: { 
      title,
      content,
      author: {
        connect: {
          name: 'Rahul',
        }
      }
    }
  });

  redirect("/feed");
}