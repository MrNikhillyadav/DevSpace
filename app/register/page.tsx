"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Icons } from "@/components/icons"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const { data: session } = useSession()
  if (session) {
    redirect('/feed')
  }

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadId = toast.loading('Signing up...')
    setIsLoading(true)

    if (!values.email || !values.password) {
      toast.error('Email and password missing!')
      toast.dismiss(loadId)
      return
    }
    
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    })

    toast.dismiss(loadId)
    if (!res?.error) {
      router.push('/login')
      toast.success('Signed Up successfully')
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
    <div className="min-h-screen  bg-zinc-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md mt-12 bg-zinc-800/50 border-zinc-700">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            Join <span className="text-indigo-500">DevSpace.</span> today
          </CardTitle>
          <p className="text-zinc-400">
            Enter your information to create an account
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Confirm Password</FormLabel>
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
              {form.formState.errors.root && (
                <p className="text-red-400 text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-indigo-700 text-white"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <div className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}