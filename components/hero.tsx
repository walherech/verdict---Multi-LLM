'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Waves, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse-slow delay-1000" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/8 rounded-full animate-pulse-slow delay-2000" />
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-white/6 rounded-full animate-pulse-slow delay-3000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-8"
          >
            <div className="sound-wave relative">
              <Waves className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white">
              Chorus
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-lg px-6 py-2">
              4 AI Minds in Perfect Harmony
            </Badge>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Every problem gets the collective intelligence it deserves
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Perplexity researches. Claude analyzes. GPT-4 synthesizes. Grok critiques. 
              <br className="hidden md:block" />
              Experience the power of AI collaboration.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <Link href="/solve">
              <Button 
                size="xl" 
                variant="outline"
                className="bg-white text-purple-600 hover:bg-white/90 border-white text-xl font-semibold px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Solve Your First Problem
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-12"
          >
            <p className="text-white/70 text-lg">
              Trusted by <span className="font-semibold text-white">70+ founders and creators</span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}

