import "./globals.css"
import { cn } from '@/lib/utils';
import { Bricolage_Grotesque } from "next/font/google";
import { getServerSession } from "next-auth"
import Provider from "@/components/Provider"
import { Toaster } from "sonner";
import Navbar  from "@/components/Navbar"

const bricolage = Bricolage_Grotesque({
  variable: "--bricolage-font",
  subsets: ["latin"],
  display: "swap",
});

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
    <html  suppressHydrationWarning={true}  lang="en">
      <body  
          suppressHydrationWarning={true}
          className={cn(
            'font-bricolage antialiased',
            bricolage.variable,
          )}
          >
        <Provider session={session}>
          <div className="min-h-screen">
            <Navbar />
            <main 
              className="container bg-gradient-to-br from-black  to-zinc-900 mx-auto "
              >
              {children}
              <Toaster richColors />
            </main>
          </div>
        </Provider>
      </body>
    </html>
  )
}