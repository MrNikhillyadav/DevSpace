// import { cache } from "react";
// import prisma  from "@/lib/db"

// const getPost = cache(async (slug:string) => {
//     const post = await prisma.post.findUnique({
//         where: { slug },
//       });
    
//       return post;

// })

// export default async function Page({params : {slug}}){
//     const post = getPost(slug)
//     return (
//         <div>
//                 {post}
//         </div>
//     )
// }