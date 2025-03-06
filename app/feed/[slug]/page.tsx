import { cache } from "react";
import prisma  from "@/lib/db"

const getPost = cache(async (slug:string) => {
    const post = await prisma.post.findFirst({
        where: {
            slug, 
        } ,
      });
      return post;
})

// @ts-expect-error : fix the error
export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return <div className="flex items-center text-white w-full h-screen justify-center flex-col ">
              Title: {post?.title}
              Content: {post?.content}
    </div>
}

