'use client'

import {signIn} from 'next-auth/react'
import {Button} from '../ui/button'

export const LoginButton = () => {
  return (
    <Button variant="primary" onClick={() => signIn('google', {callbackUrl: '/'})}>
      Sign in with Google
    </Button>
  )
}