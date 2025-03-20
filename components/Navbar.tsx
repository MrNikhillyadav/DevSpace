"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiNotification2Fill } from "react-icons/ri";
import { FaPenClip } from "react-icons/fa6";
import { Code, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import NotificationCard from "@/components/NotificationCard";

export default function Navbar() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const loadId = toast.loading('Signing out...');
    setIsLoading(true);

    await signOut({ redirect: false });

    toast.dismiss(loadId);
    router.push('/login');
    toast.success('Logged out');
    router.refresh();
    setIsLoading(false);
  }

  const notifications = [
    {
      id: 1,
      avatarSrc: session?.user?.image,
      message: "Karan posted about how React JS works under the hood.",
      time: "5 min ago"
    },
    {
      id: 2,
      avatarSrc: session?.user?.image,
      message: "Alex commented on your post.",
      time: "10 min ago"
    },
    {
      id: 3,
      avatarSrc: session?.user?.image,
      message: "You have a new follower.",
      time: "15 min ago"
    }
  ];

  return (
    <nav className="md:px-12 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <Link href="/" className="text-xl font-semibold text-white">
            DevSpace<span className="text-indigo-500">.</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/feed" className="text-zinc-400 hover:text-white text-sm transition-colors">
            Feed
          </Link>
          <div className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm cursor-pointer transition-colors">
            Explore <ChevronDown size={14} />
          </div>
          <Link href="/settings" className="text-zinc-400 hover:text-white text-sm transition-colors">
            Settings
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button 
                asChild
                className="bg-primary hidden md:block hover:bg-indigo-700 rounded-full w-10 h-10 p-0"
              >
                <Link href="/publish-new-blog">
                  <FaPenClip className="w-4 h-4" />
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="rounded-full hidden md:block  w-10 h-10 p-0 text-zinc-400 hover:text-white border border-zinc-700"
                  >
                    <RiNotification2Fill className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800">
                  <div className="px-4 py-3 text-sm font-medium text-white border-b border-zinc-800">
                    Latest Notifications
                  </div>
                  {notifications.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      avatarSrc={notification.avatarSrc}
                      message={notification.message}
                      time={notification.time}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar>
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback className="bg-primary text-white">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm font-medium text-white">{session.user?.name}</p>
                    <p className="text-xs text-zinc-400">{session.user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800">
                    <Link href="/profile" className="text-zinc-300">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800">
                    <Link href="/dashboard" className="text-zinc-300">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    {isLoading ? 'Signing Out' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                asChild 
                
                className="text-zinc-400 hidden md:block hover:text-white"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                size="md"
                className="bg-primary hover:bg-indigo-700 text-white"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}