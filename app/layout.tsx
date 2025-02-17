import "./globals.css"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Provider from "@/components/Provider"
import { Toaster } from "sonner";
import Navbar  from "@/components/Navbar"

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
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <div className="min-h-screen">
            <Navbar />
            <main className="container bg-gradient-to-br from-black to-zinc-900 mx-auto ">
              {children}
              <Toaster richColors />
            </main>
          </div>
        </Provider>
      </body>
    </html>
  )
}