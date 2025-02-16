import prisma  from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaBookmark } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { BsBookmarkPlus } from "react-icons/bs";

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
    <div className="p-8 bg-primary-foreground  max-w-[900px] mx-auto  rounded-sm ">
    

      <section className="grid grid-cols-1   gap-2">
        {posts.map((post) => (
          <Card key={post.id} className='shadow-sm' >
            <Link href={`/post/${post.id}`}>
            <CardFooter>
                <div className="flex  items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback>
                      <p className="line-clamp-3 text-sm  text-muted-foreground">
                        {post.author.name?.charAt(0) || "U"}
                      </p>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center items-center ">
                    <span className="text-sm font-medium">{post.author.name}</span>
                    <span className="text-[12px] text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardFooter>
              <CardHeader>
                <CardTitle className=" line-clamp-3 text-black/80 p-1">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm  text-muted-foreground">
                  {post.content.substring(0, 150)}...
                </p>
              <div className='flex justify-between gap-2  items-center pt-3'> 
                  <div>
                    <div className='flex justify-between gap-2  items-center'>
                       <FaRegHeart className='text-lg  hover:fill-red-600' />
                       <p className='text-xs '> {Math.floor(Math.random()*100)} Likes</p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2  items-center">
                  <FiShare2 />
                  <BsBookmarkPlus />
                  </div>
              </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </section>
    </div>
  )
}