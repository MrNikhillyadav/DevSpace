'use client';

import React, { useState,useEffect, FormEvent,useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { publishNewBlogPost } from "./action";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icons } from "@/components/icons"
import { generateHandle } from '@/lib/utils'
import RichTextEditor from '@/components/RichTextEditor/index';

const PublishNewBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleEditorChange = (newContent:string) => {
    setContent(newContent);
  };

  useEffect(() => {
    inputRef.current?.focus()
  },[])

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    
    console.log("Validating content:", content);
    if (!content || !content.trim()) {
      setError('Content is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    
    if (!validateForm()) {
      return;
    }

    const loadId = toast.loading('Publishing ...');
    setIsSubmitting(true);

    const slug = generateHandle(title);
    console.log('generated-slug:', slug);

    try {
      const res = await publishNewBlogPost({
        title: title.trim(),
        content: content.trim(), 
        slug: slug
      });

      console.log(`res:`, res);
      toast.dismiss(loadId);

      if (!res?.error) {
        router.refresh();
        router.push('/feed');
        toast.success('Published successfully');
      } else {
        if (res.status === 401) {
          toast.error('Invalid input, try again!');
        } else if (res.status === 400) {
          toast.error('Missing content!');
        } else if (res.status === 404) {
          toast.error('Account not found!');
        } else if (res.status === 403) {
          toast.error('Forbidden!');
        } else {
          toast.error('oops something went wrong..!');
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.dismiss(loadId);
      toast.error('An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-[1000px] bg-zinc-900 border-none">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="flex flex-row items-center justify-between text-2xl mt-12 font-bold text-white">
            <h1 className="ml-4">Write the New Article</h1>
            <form onSubmit={handleSubmit}>
               <Button
                type="submit"
                className=" bg-primary hover:bg-indigo-600 text-white"
                disabled={isSubmitting}>

              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </div>
              ) : (
                'Publish'
              )}
            </Button>
            </form>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className='text-sm text-red-500'> 
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">Title</Label>
              <Input
                id="title"
                value={title}
                ref={inputRef}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-zinc-300">Content</Label>
              <RichTextEditor 
                content={content} 
                setContent={setContent} 
                onChange={handleEditorChange}
              />
            </div>

           

            <div className="text-xs text-zinc-500 text-right">
              Content length: {content?.length || 0} characters
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/feed" className="text-indigo-400 hover:underline">
              Cancel
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublishNewBlog;