
import Link from "next/link"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { BsBookmarkPlus } from "react-icons/bs";

interface PostInterface {
    id: string;
    image: string | null;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    email: string | null;
    emailVerified: Date | null;
    password: string | null;
    bio: string | null;
    title:string | null;
    content:string | null;
    author:{
      image: string | null;
      name: string | null;
    }
   
  }

  interface AllPostComponentsProps {
    posts: PostInterface[];
}
  

export default async function AllPostComponents({posts}:AllPostComponentsProps) {

  return (
    <div className=" space-y-2 max-w-[900px] mx-auto  rounded-lg ">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight ">Welcome to <span className="text-primary ">nova</span> blog</h1>
        <p className="text-md text-muted-foreground">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </section>

      <section className="grid grid-cols-1  gap-4 ">
        {posts.map((post) => (
          <Card key={post.id} className='shadow-sm' >
            <Link href={`/post/${post.id}`}>
             
              <CardFooter>
                <div className="flex items-center space-x-4">
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