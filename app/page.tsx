import LandingPage from "@/components/LandingPage"
import { getServerSession } from "next-auth"
import {redirect} from 'next/navigation'
import {feed} from "./feed/page"

export default async function Home() {
  // const session = await getServerSession()
    redirect('/feed')
  return (
    <>
      <LandingPage/>
    </>
  )
}