'use client'

import { signIn } from 'next-auth/react'

export default function LoginButton() {
  async function handleLogin() {
    try {
      console.log('Starting Google sign in...') // デバッグログ
      await signIn('google', {
        callbackUrl: '/',
        redirect: true,
      })
      console.log('Sign in function called') // デバッグログ
    } catch (error) {
      console.error('Error during sign in:', error) // エラーログ
      alert('Sign in failed. Please try again.') // エラー時のフィードバック
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign
    </button>
  )
}