import LandingPage from "@/components/landing/LandingPage"
import { getServerSession } from "next-auth"
import {redirect} from 'next/navigation'

export default async function Home() {
  const session = await getServerSession()
    if(session?.user){
      redirect('/feed')
    }
  return (
    <main className=" bg-gradient-to-br from-black to-zinc-900">
      <LandingPage/>
    </main>
  )
}