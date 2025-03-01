import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextAuthProvider } from '@/components/providers/next-auth-provider'
import Header from '@/components/layout/header'
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learning Log',
  description: 'Track your learning progress',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ja">
      <head>
        {gaId && (
          <>
            {/* gtag.js の読み込み */}
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            {/* Google Analytics 設定スクリプト */}
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className} cz-shortcut-listen="true">
        <NextAuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  )
}
