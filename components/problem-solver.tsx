'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Search, Brain, Sparkles, Zap, Send, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProblemSolverProps {
  onSolve: (problem: string) => Promise<any>
}

const steps = [
  {
    id: 'research',
    icon: Search,
    title: 'Research',
    subtitle: 'Perplexity',
    description: 'Gathering information...',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'analysis',
    icon: Brain,
    title: 'Analysis',
    subtitle: 'Claude',
    description: 'Analyzing findings...',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'synthesis',
    icon: Sparkles,
    title: 'Synthesis',
    subtitle: 'GPT-4',
    description: 'Creating solution...',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'critique',
    icon: Zap,
    title: 'Critique',
    subtitle: 'Grok',
    description: 'Refining answer...',
    color: 'from-purple-500 to-pink-500'
  }
]

export function ProblemSolver({ onSolve }: ProblemSolverProps) {
  const [problem, setProblem] = useState('')
  const [isSolving, setIsSolving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!problem.trim()) return

    setIsSolving(true)
    setCurrentStep(0)
    setProgress(0)
    setResult(null)
    setError(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return newProgress
      })
    }, 200)

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    try {
      const response = await onSolve(problem)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSolving(false)
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }

  const handleReset = () => {
    setProblem('')
    setIsSolving(false)
    setCurrentStep(0)
    setProgress(0)
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Problem Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              What problem needs solving?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Describe your problem in detail. The more context you provide, the better Chorus can help..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="min-h-[200px] text-lg resize-none"
              maxLength={5000}
              disabled={isSolving}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {problem.length}/5000 characters
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!problem.trim() || isSolving}
                size="lg"
                className="gradient-bg text-white hover:opacity-90"
              >
                {isSolving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Chorus is working...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Let Chorus Solve This
                    <span className="ml-1">→</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Section */}
      <AnimatePresence>
        {isSolving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Chorus is working...
                </CardTitle>
                <p className="text-center text-gray-600">
                  Estimated time: ~30-60 seconds
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {steps.map((step, index) => {
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep
                    const StepIcon = step.icon

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: isActive ? 1.05 : 1,
                          y: isActive ? -5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                          isActive 
                            ? 'border-purple-300 bg-purple-50 shadow-lg' 
                            : isCompleted
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-center space-y-3">
                          <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center ${
                            isActive ? 'animate-pulse' : ''
                          }`}>
                            <StepIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.subtitle}</p>
                            <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Something went wrong</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <Button onClick={handleReset} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

