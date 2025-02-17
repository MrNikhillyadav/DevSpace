"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from 'sonner'
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Icons } from "@/components/icons"
import { formSchema } from "@/lib/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      router.push('/feed')
    }
  }, [session, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadId = toast.loading('Signing in...')
    setIsLoading(true)
    setError(null)

    if (!values.email || !values.password) {
      toast.error('Email and password required, try again!')
      toast.dismiss(loadId)
      return
    }

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    })

    toast.dismiss(loadId)
    if (!res?.error) {
      router.push('/feed')
      toast.success(`Signed In`)
    } else {
      if (res.status === 401) {
        toast.error('Invalid Credentials, try again!')
      } else if (res.status === 400) {
        toast.error('Missing Credentials!')
      } else if (res.status === 404) {
        toast.error('Account not found!')
      } else if (res.status === 403) {
        toast.error('Forbidden!')
      } else {
        toast.error('Oops something went wrong..!')
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome to <span className="text-indigo-500">DevSpace.</span>
          </CardTitle>
          <p className="text-zinc-400">
            Enter your credentials to sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        {...field}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-sm text-red-400 text-center">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <div className="text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-400 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}