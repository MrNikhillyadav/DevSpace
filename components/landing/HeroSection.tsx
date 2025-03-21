import React from 'react';
import { Button } from '@/components/ui/button';
import {  ArrowRight,  BookOpen  } from 'lucide-react';
import { Spotlight } from './Spotlight';
import Link from 'next/link'


export const HeroSection = () => (
    <Spotlight className="container mx-auto px-4 pt-24 pb-32 text-center">
      <div className="inline-flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full mb-8">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <span className="text-zinc-300">New Feature</span>
        <span className="text-zinc-400 hidden md:block">AI-Powered Code Snippets</span>
        <ArrowRight size={16} className="text-zinc-400" />
      </div>
  
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        <span className="text-white">Where developers</span>
        <br />
        <span className="text-zinc-500">share their stories.</span>
      </h1>
  
      <p className="text-zinc-400 text-md md:text-xl mb-12 max-w-2xl mx-auto">
        Write, share, and grow with a community of developers. Transform your coding journey into compelling stories.
      </p>
  
      <div className=" flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
        <Link href="/feed">
          <Button className="bg-primary hover:bg-indigo-700 text-white px-10 md:px-8 py-6">
            Start Writing
          </Button>
        </Link>
        <Link href="/feed">
          <Button variant="outline" className="text-black hover:text-white border-zinc-700 hover:bg-zinc-800 px-8 py-6">
             <BookOpen size={16} className="mr-2 hidden md:block" /> Explore Articles 
          </Button>
        </Link>
      </div>
    </Spotlight>
  );
