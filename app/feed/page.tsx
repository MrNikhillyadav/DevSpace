import prisma  from "@/lib/db"
import AllPostComponents from "@/components/AllPostComponents";
import {getServerSession} from "next-auth";
import { redirect } from "next/navigation";

async function getLatestPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },

  })
  return posts
}

export default async function Feed() {
  const session = await getServerSession()
  if(!session?.user){
    redirect('/login')
  }
  const posts = await getLatestPosts()


  return (
    <div>
      <AllPostComponents posts={posts}/>
    </div>
  )
}