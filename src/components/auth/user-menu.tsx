'use client'

import {signOut, useSession} from 'next-auth/react'
import { Button } from '../ui/button'

export const UserMenu = () => {
  const {data: session} = useSession()

  if (!session) {
    return null
  }

  return (
    <div className='flex items-center gap-4'>
      <div className="flex item-center gap-2">
        {session.user?.image && (
          <img src={session.user.image} alt="Profile" className='w-8 h-8 rounded-full' />
        )}
        <span className='font-medium'>
          {session.user?.name}
        </span>
      </div>
      <Button variant='ghost' onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  )
}