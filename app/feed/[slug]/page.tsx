import { cache } from "react";
import prisma  from "@/lib/db"

const getPost = cache(async ({params}:{params:{slug:string}}) => {
    console.log(params.slug)
    const post = await prisma.post.findUnique({
        where: {
            slug : params.slug, 
        } ,
      });
    
      return post;

})

//@ts-expect-error : fix the id type error
export default async function Page({params : slug}){
    const post = await getPost(slug)
    return (
        <div> 
                
                {post?.title}
        </div>
    )
}