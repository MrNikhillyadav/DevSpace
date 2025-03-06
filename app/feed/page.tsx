import prisma  from "@/lib/db"
import AllPostComponents, { PostInterface } from "@/components/AllPostComponents";
import {getServerSession} from "next-auth";
import { redirect } from "next/navigation";

async function getLatestPosts(): Promise<PostInterface[]> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc', 
    },
  })
  return posts as PostInterface[]
}

export default async function Feed() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/login')
  }
  const posts: PostInterface[] = await getLatestPosts()

  return (
    <div>
      <AllPostComponents posts={posts} />
    </div>
  )
}
