import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Provider from "@/components/Provider"
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Blog Platform",
  description: "A modern blog platform built with Next.js",

}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <div className="min-h-screen  bg-background">
            <Navbar />
            <main className="container bg-primary-foreground mx-auto px-4 py-8">
              {children}
              <Toaster richColors />
            </main>
          </div>
        </Provider>
      </body>
    </html>
  )
}