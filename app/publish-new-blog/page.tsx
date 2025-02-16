'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { publishNewBlogPost } from "./action";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {revalidatePath} from 'next/cache'

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

  const handleSubmit = async (e) => {
    const loadId = toast.loading('Publishing ...');
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      toast.dismiss(loadId);
      return;
    }

    setIsSubmitting(true);

      const res = await publishNewBlogPost({
        title: title.trim(),
        content: content.trim()
      });
      
      toast.dismiss(loadId);

      if (!res?.error) {
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
      
      revalidatePath('/feed')
      setIsSubmitting(false);   
  }
};

  return (
    <main className="m-auto my-6 max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] p-2 border rounded-md"
                placeholder="Write your article content here..."
                maxLength={5000}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Publishing...
                </div>
              ) : (
                'Publish'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default PublishNewBlog;




