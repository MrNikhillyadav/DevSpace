import prisma  from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <div className="space-y-8   max-w-[900px] mx-auto  rounded-lg ">
    

      <section className="grid grid-cols-1  gap-2">
        {posts.map((post) => (
          <Card key={post.id}>
            <Link href={`/post/${post.id}`}>
              <CardHeader>
                <CardTitle className=" line-clamp-3 text-black/80 p-1">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-md  text-muted-foreground">
                  {post.content.substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback>
                      {post.author.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{post.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </section>
    </div>
  )
}