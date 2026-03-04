'use client'

import { useState } from 'react'
import { ProblemSolver } from '@/components/problem-solver'
import { ResultsDisplay } from '@/components/results-display'
import { Waves } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SolvePage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSolve = async (problem: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      })

      if (!response.ok) {
        throw new Error('Failed to solve problem')
      }

      const data = await response.json()
      setResult(data)
      return data
    } catch (error) {
      console.error('Error solving problem:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="sound-wave relative">
                <Waves className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-2xl font-bold gradient-text">Chorus</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/solve" className="text-purple-600 font-medium">
                Solve
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {result ? (
            <ResultsDisplay result={result} onReset={handleReset} />
          ) : (
            <ProblemSolver onSolve={handleSolve} />
          )}
        </div>
      </main>
    </div>
  )
}

