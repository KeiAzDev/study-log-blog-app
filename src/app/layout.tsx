import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { LoginButton } from "@/components/auth/login-button";
import { UserMenu } from "@/components/auth/user-menu";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Learing Log App',
  description: 'Track your learing progress',
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="ja">
      <body cz-shortcut-listen="true" className={inter.className}>
        <NextAuthProvider>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">Learning Log</h1>
              <div>
                <LoginButton />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  )
}