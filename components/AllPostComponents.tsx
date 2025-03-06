"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { FiShare2 } from "react-icons/fi"
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs"
import { BiCommentDetail } from "react-icons/bi"
import { Code, Terminal } from "lucide-react"
import { useSession } from "next-auth/react"
import prisma from "@/lib/db"

export interface PostInterface {
    id: string;
    image?: string | null;
    name?: string | null;
    createdAt: Date;
    updatedAt: Date;
    email?: string | null;
    emailVerified?: Date | null;
    password?: string | null;
    bio?: string | null;
    title?: string | null;
    slug: string | null;
    content?: string | null;
    author: {
      image?: string | null;
      name?: string | null;
    }
}

interface AllPostComponentsProps {
    posts: PostInterface[];
}


const TrendingTopics = () => (
  <div className="flex gap-2 overflow-x-auto pb-4 max-w-[900px] mx-auto">
    {["React", "TypeScript", "Next.js", "Node.js", "Python", "AWS", "DevOps"].map((topic) => (
      <Badge
        key={topic}
        variant="secondary"
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer px-4 py-2"
      >
        {topic}
      </Badge>
    ))}
  </div>
);

export default function AllPostComponents({ posts }: AllPostComponentsProps) {

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const toggleSave = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  return (
    <div className="space-y-6 py-8 pt-20 flex flex-col justify-center items-center  bg-zinc-900 min-h-screen">
      <section className="text-center space-y-4 max-w-[900px] mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome to <span className="text-indigo-500">DevSpace</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Discover stories, thinking, and expertise from developers worldwide.
        </p>
      </section>

      <TrendingTopics />

      <section className="grid grid-cols-1  gap-6 max-w-[900px] mx-auto px-4">
        {posts.map((post) => (
          <Card  key={post.slug} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/80 transition-colors">
            <Link href={`/feed/${post.slug}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback className="bg-primary text-white">
                      {post.author.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{post.author.name}</span>
                    <span className="text-xs text-zinc-400">
                      {/* {new Date(post.createdAt).toLocaleDateString()} */}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                  <p className="text-zinc-400 line-clamp-3">
                    {post.content?.substring(0, 150)}...
                  </p>
                </div>

                {/* Tech stack badges */}
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-indigo-400 border-indigo-400/30">
                    <Code className="w-3 h-3 mr-1" />
                    React
                  </Badge>
                  <Badge variant="outline" className="text-indigo-400 border-indigo-400/30">
                    <Terminal className="w-3 h-3 mr-1" />
                    TypeScript
                  </Badge>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
                  <div className="flex gap-6">
                    <button 
                      onClick={(e) => toggleLike(post.id, e)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400"
                    >
                      {likedPosts.has(post.id) ? 
                        <FaHeart className="text-indigo-500" /> : 
                        <FaRegHeart />
                      }
                      <span className="text-sm">{38}</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400">
                      <BiCommentDetail />
                      <span className="text-sm">{15}</span>
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="text-zinc-400 hover:text-indigo-400">
                      <FiShare2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => toggleSave(post.id, e)}
                      className="text-zinc-400 hover:text-indigo-400"
                    >
                      {savedPosts.has(post.id) ? 
                        <BsBookmarkFill className="text-indigo-500" /> : 
                        <BsBookmarkPlus />
                      }
                    </button>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}