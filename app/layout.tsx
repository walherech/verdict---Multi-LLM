import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Verdict — Multiple AIs. One Answer.',
  description: 'Multiple AIs. One answer. No mercy.',
  keywords: ['AI', 'problem solving', 'multi-LLM', 'artificial intelligence', 'collaborative AI'],
  authors: [{ name: 'Verdict' }],
  openGraph: {
    title: 'Verdict — Multiple AIs. One Answer.',
    description: 'Multiple AIs. One answer. No mercy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verdict — Multiple AIs. One Answer.',
    description: 'Multiple AIs. One answer. No mercy.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

