import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";
import { Metadata } from "next";

type PostAuthor = {
  name: string | null;
  image: string | null;
};

type PostType = {
  id: string;
  title: string | null;
  content: string;
  slug: string | null;
  createdAt: Date;
  authorId: string;
  author: PostAuthor;
};

type PageParams = {
  slug: string;
}

const getPost = async (slug: string): Promise<PostType | null> => {
  const post = await prisma.post.findFirst({
    where: {
      slug,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  
  return post as PostType | null;
};

const getRelatedPosts = async (take: number, skip: number, slug: string): Promise<PostType[]> => {
  const relatedPosts = await prisma.post.findMany({
    take: take,
    skip: skip,
    where: {
      AND: [
        {
          slug: {
            not: slug  // excluding the current opened post (title-slug)
          }
        },
        {
          published: true
        }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      }
    }
  });
  return relatedPosts as PostType[];
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post not found | DevSpace',
    };
  }
  
  return {
    title: `${post.title || 'Post'} | DevSpace`,
    description: post.content?.substring(0, 160),
  };
}

export default async function BlogPage({ 
  params,
}: {
  params: Promise<PageParams>;
  
}) {
  const resolvedParams = await params;
  const {slug} = resolvedParams;
  const post = await getPost(slug);
  const relatedPosts = await getRelatedPosts(4, 1, slug);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <Link href="/feed" className="text-indigo-400 hover:text-indigo-300">
            Return to feed
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-900">
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <Link
          href="/feed"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to feed
        </Link>

        <article className="space-y-8">
          {/* Author info */}
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author?.image || undefined} />
              <AvatarFallback className="bg-indigo-600 text-white">
                {post.author?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {post.author?.name || "Anonymous"}
              </span>
              <span className="text-xs text-zinc-400">
                {formattedDate} • {Math.ceil((post.content?.length || 0) / 1000)} min read
              </span>
            </div>
          </div>

          {/* Post title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>

          {/* Tech badges - can be dynamic based on post data */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-indigo-400 border-indigo-400/30"
            >
              React
            </Badge>
            <Badge
              variant="outline"
              className="text-indigo-400 border-indigo-400/30"
            >
              TypeScript
            </Badge>
            <Badge
              variant="outline"
              className="text-indigo-400 border-indigo-400/30"
            >
              Next.js
            </Badge>
          </div>

          {/* Post content */}
          <Card className="border-none bg-zinc-900">
            <CardContent className="pt-6 text-zinc-300 leading-relaxed">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>

          </Card>

          {/* Engagement section */}
          <div className="flex justify-between items-center pt-6 border-zinc-700">
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-zinc-400">
                <span>38 likes</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span>15 comments</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors">
                Share
              </button>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-white transition-colors">
                Save
              </button>
            </div>
          </div>
        </article>

        {/* Related posts section */}
        <div className="mt-20">
          <h2 className="text-xl font-bold text-white mb-6">
            Explore more posts
          </h2>
          <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map(({id, title, content, author, slug}) => (
              <Card
                key={id}
                className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/80 transition-colors"
              >
                <Link href={`/feed/${slug}`} className="block p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={author?.image || undefined} />
                      <AvatarFallback className="bg-indigo-600 text-white text-xs">
                        {author?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-zinc-400">{author.name}</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">
                    {title}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {content ? content.replace(/<[^>]*>/g, '').substring(0, 100) : ''}...<span className="text-white">{" "}read more</span>
                  </p>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}