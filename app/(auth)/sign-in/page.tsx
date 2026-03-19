import React, { useState } from 'react'
import {useDebounceValue} from 'usehooks-ts'
const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 300)
  
  return (
    <div>
      
    </div>
  )
}

export default page
