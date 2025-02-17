"use client"

import { IoSettingsSharp } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <IoSettingsSharp className="text-2xl text-indigo-500" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add your settings content here */}
          <p className="text-zinc-400">
            Manage your account settings and preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
