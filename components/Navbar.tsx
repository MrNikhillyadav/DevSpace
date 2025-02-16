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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import NotificationCard from "@/components/NotificationCard"; // Import the NotificationCard component

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
    <nav className="border-b px-20 ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            <span className="text-2xl tracking-tighter text-primary font-bold">nova.</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">Feed</Link>
            <Link href="/settings" className="text-sm font-medium hover:text-primary">Settings</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Button asChild>
                <Link href="/publish-new-blog">
                  <FaPenClip />
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button asChild variant="outline">
                    <Link href="/notifications">
                      <RiNotification2Fill />
                    </Link>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 ">
                  <div className="px-2 py-1.5 text-sm font-medium ">
                    Latest Notifications
                  </div>

                  {/* Render notifications */}
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

              <Button onClick={handleSignOut} variant="outline" className="cursor-pointer" asChild>
                <span>Logout</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={session.user?.image || undefined} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    {session.user?.email}
                  </div>
                  {/* Other dropdown items */}
                  <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/notifications">Notifications</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link href="/login">Sign In</Link></Button>
              <Button asChild><Link href="/register">Get Started</Link></Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
