"use client"

import React, { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

// Only these 3 shadcn components needed — no form.tsx required
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const Page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // FIX: useDebounceValue returns a tuple, destructure it
  const [debouncedUsername] = useDebounceValue(username, 300)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          )
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success("Account created!", {
        description: response.data.message,
      })
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      console.error("Error in signup:", error)
      const axiosError = error as AxiosError<ApiResponse>
      // FIX: was showing "Success" on error
      toast.error("Signup failed", {
        description: axiosError.response?.data.message ?? "Something went wrong",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isUsernameAvailable =
    !isCheckingUsername && usernameMessage.toLowerCase().includes('available')
  const isUsernameTaken =
    !isCheckingUsername && usernameMessage !== '' && !isUsernameAvailable

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details below to get started
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-card p-8 shadow-sm space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="Enter the name"
                  {...register("username")}
                  onChange={(e) => {
                    // Keep both RHF and local state in sync
                    register("username").onChange(e)
                    setUsername(e.target.value)
                  }}
                  className="pr-9"
                />
                {/* Live check icon */}
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {isUsernameAvailable && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {isUsernameTaken && (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </span>
              </div>
              {/* API availability message */}
              {usernameMessage && (
                <p className={`text-xs ${isUsernameAvailable ? 'text-green-500' : 'text-destructive'}`}>
                  {usernameMessage}
                </p>
              )}
              {/* Zod validation error */}
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter the email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Page