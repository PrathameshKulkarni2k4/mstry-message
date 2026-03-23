"use client"

import React, { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, useForm } from "react-hook-form"
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 300)
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
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
        setisCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)

          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setisCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      toast("Success", {
          description: response.data.message,
        })
      router.replace(`/verify/${username}`)
      setisSubmitting(false)

    } catch (error) {
      console.error("error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message

        toast("Success", {
          description: errorMessage,
        })
      

      setisSubmitting(false)
    }
  }


  return (
    <div className="">
    </div>
  )
}

export default page
