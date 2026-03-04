import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chorus - 4 AI Minds in Perfect Harmony',
  description: 'Perplexity researches. Claude analyzes. GPT-4 synthesizes. Grok critiques. Every problem gets the collective intelligence it deserves.',
  keywords: ['AI', 'problem solving', 'multi-LLM', 'artificial intelligence', 'collaborative AI'],
  authors: [{ name: 'Chorus Team' }],
  openGraph: {
    title: 'Chorus - 4 AI Minds in Perfect Harmony',
    description: 'Perplexity researches. Claude analyzes. GPT-4 synthesizes. Grok critiques. Every problem gets the collective intelligence it deserves.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chorus - 4 AI Minds in Perfect Harmony',
    description: 'Perplexity researches. Claude analyzes. GPT-4 synthesizes. Grok critiques. Every problem gets the collective intelligence it deserves.',
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

