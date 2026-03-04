'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Search, Brain, Sparkles, Zap, Copy, Share2, Check, ChevronDown, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

interface ResultsDisplayProps {
  result: any
  onReset: () => void
}

const aiSections = [
  {
    id: 'research',
    icon: Search,
    title: 'Research Findings',
    subtitle: 'Perplexity',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'analysis',
    icon: Brain,
    title: 'Deep Analysis',
    subtitle: 'Claude',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'synthesis',
    icon: Sparkles,
    title: 'Solution Synthesis',
    subtitle: 'GPT-4',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'critique',
    icon: Zap,
    title: 'Critical Review',
    subtitle: 'Grok',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
]

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.solution || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Solution from Chorus',
          text: result.solution || '',
          url: window.location.href
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy URL:', err)
      }
    }
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Solution from Chorus
        </h2>
        <p className="text-gray-600">
          Four AI minds have collaborated to solve your problem
        </p>
      </motion.div>

      {/* Main Solution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Final Solution
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {result.solution || 'No solution provided'}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          How Each AI Contributed
        </h3>
        
        <div className="space-y-4">
          {aiSections.map((section, index) => {
            const isOpen = openSections.includes(section.id)
            const content = result[section.id] || 'No content available'
            const SectionIcon = section.icon

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                  <Card className={`border-2 ${section.borderColor} ${section.bgColor} hover:shadow-lg transition-all duration-300`}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-opacity-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                              <SectionIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-900">
                                {section.title}
                              </CardTitle>
                              <p className="text-gray-600">{section.subtitle}</p>
                            </div>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="prose prose-gray max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {content}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Metadata Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Card className="border-0 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <Badge variant="outline" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Solved in {result.solveTime || '45'} seconds
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {result.iterations || '3'} iterations used
              </Badge>
              <Badge variant="success" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quality: {result.quality || 'High'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="text-center"
      >
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Solve Another Problem
        </Button>
      </motion.div>
    </motion.div>
  )
}

