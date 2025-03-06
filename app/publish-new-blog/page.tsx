'use client';

import React, { useState, useRef } from 'react';
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
import Link from 'next/link'; // Import Link for navigation
import {revalidatePath} from 'next/cache'
import { Icons } from "@/components/icons"
import { generateHandle } from '@/lib/utils'

const PublishNewBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    return true;
  };

  //@ts-expect-error lets ignore the e error type
  const handleSubmit = async (e) => {
    const loadId = toast.loading('Publishing ...');
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      toast.dismiss(loadId);
      return;
    }

    setIsSubmitting(true);

      const slug =  generateHandle(title)
      console.log('generated-slug: ', slug);

      const res = await publishNewBlogPost({
        title: title.trim(),
        content: content.trim(),
        slug : slug
      });

      console.log(`res : ${res?.message}`)
      
      toast.dismiss(loadId);

      if (!res?.error) {
        router.push('/feed');
        toast.success('Published successfully');
      } else {
          //@ts-expect-error lets ignore the status type
        if (res.status === 401) {
          toast.error('Invalid input, try again!');
           //@ts-expect-error lets ignore the status type
        } else if (res.status === 400) {
          toast.error('Missing content!');
           //@ts-expect-error lets ignore the status type
        } else if (res.status === 404) {
          toast.error('Account not found!');
           //@ts-expect-error lets ignore the status type
        } else if (res.status === 403) {
          toast.error('Forbidden!');
        } else {
          toast.error('oops something went wrong..!');
        }
      
      revalidatePath('/feed')
      setIsSubmitting(false);   
  }
};

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            Publish New Article
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-zinc-300">Content</Label>
              <textarea
                id="content"
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                placeholder="Write your article content here..."
                maxLength={5000}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
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
