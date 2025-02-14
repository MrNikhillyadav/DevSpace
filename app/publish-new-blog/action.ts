"use server";

import prisma from "@/lib/db";
import { newBlogSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export  async function publishNewBlogPost(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  console.log(values)
  const {title,content, } = newBlogSchema.parse(values);
  

  await prisma.post.create({
    data: {
        // TODO: ADD TITLE-SLUG| IMAGE BLOB 
      title: title.trim(),
      content: content?.trim(),
     
    },
  });

  redirect("/feed");
}