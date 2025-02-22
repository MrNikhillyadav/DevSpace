import { cache } from "react";
import prisma  from "@/lib/db"

const getPost = cache(async (id:string) => {
    const post = await prisma.post.findUnique({
        where: {
            id 
        } ,
      });
    
      return post;

})

//@ts-expect-error : fix the id type error
export default async function Page({params : id}){
    const post = await getPost(id)
    return (
        <div> 
          
                {post?.title}
        </div>
    )
}