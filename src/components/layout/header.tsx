// src/components/layout/header.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'  // 追加
import LoginButton from '../auth/login-button'
import LogoutButton from '../auth/logout-button'
import { useSession } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Learning Log
          </Link>
          
          <nav className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {session.user?.name}
                </span>
                {session.user?.image && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      className="rounded-full"
                      fill
                      sizes="32px"
                    />
                  </div>
                )}
                <LogoutButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}