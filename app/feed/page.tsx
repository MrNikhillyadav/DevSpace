import prisma  from "@/lib/db"
import AllPostComponents from "@/components/AllPostComponents";

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

  const posts = await getLatestPosts()
  console.log('posts: ', posts);

  return (
    <AllPostComponents posts={posts}/>
  )
}