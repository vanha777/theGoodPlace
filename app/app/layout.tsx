import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { AppProvider } from './utils/AppContext';
import { WalletConnectionProvider } from './utils/Walletcontext';
config.autoAddCss = false
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TheGoodPlace - Store digital memories of your love one for eternity',
  description: 'The Good Place is where you can store digital memories of your love one for eternity and interract with them.',
  openGraph: {
    title: 'TheGoodPlace - Store digital memories of your love one for eternity',
    description: 'The Good Place is where you can store digital memories of your love one for eternity and interract with them.',
    // url: 'https://www.TheGoodPlace.com/',
    images: [
      {
        url: 'https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Image%2012-3-2025%20at%2011.31%20pm.jpeg',
        alt: 'TheGoodPlace - Store digital memories of your love one for eternity',
      },
    ],
  },
  icons: {
    icon: '/logo.png',
    // You can also specify different sizes
    apple: [
      { url: '/logo.png' },
      { url: '/apple.png', sizes: '180x180' }
    ],
    shortcut: '/favicon.ico'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <Head>
        {/* General Meta Tags */}
        <meta name="title" content="TheGoodPlace - Store digital memories of your love one for eternity" />
        <meta name="description" content="The Good Place is where you can store digital memories of your love one for eternity and interract with them." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.TheGoodPlace.com/" />
        <meta property="og:title" content="TheGoodPlace - Store digital memories of your love one for eternity" />
        <meta property="og:description" content="The Good Place is where you can store digital memories of your love one for eternity and interract with them." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Image%2012-3-2025%20at%2011.31%20pm.jpeg" />
        <meta property="og:image:alt" content="TheGoodPlace platform preview" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.TheGoodPlace.com/" />
        <meta name="twitter:title" content="TheGoodPlace - Store digital memories of your love one for eternity" />
        <meta name="twitter:description" content="The Good Place is where you can store digital memories of your love one for eternity and interract with them." />
        <meta name="twitter:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Image%2012-3-2025%20at%2011.31%20pm.jpeg" />
        <meta name="twitter:image:alt" content="TheGoodPlace platform preview" />
        <meta name="twitter:site" content="@TheGoodPlace" />
        <meta name="twitter:creator" content="@TheGoodPlace" />

        {/* Telegram */}
        <meta property="og:title" content="TheGoodPlace - Store digital memories of your love one for eternity" />
        <meta property="og:description" content="The Good Place is where you can store digital memories of your love one for eternity and interract with them." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Image%2012-3-2025%20at%2011.31%20pm.jpeg" />
        <meta property="og:url" content="https://www.TheGoodPlace.com/" />

        {/* Discord */}
        <meta property="og:title" content="TheGoodPlace - Store digital memories of your love one for eternity" />
        <meta property="og:description" content="The Good Place is where you can store digital memories of your love one for eternity and interract with them." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Image%2012-3-2025%20at%2011.31%20pm.jpeg" />
        <meta property="og:type" content="website" />
      </Head>
      <body suppressHydrationWarning={true} className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
} 