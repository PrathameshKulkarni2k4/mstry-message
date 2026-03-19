import React, { useState } from 'react'
import {useDebounceValue} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 300)
  const router = useRouter()

  //zod implementation


  return (
    <div>
      
    </div>
  )
}

export default page
