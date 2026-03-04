'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Brain, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Search,
    title: "Perplexity",
    subtitle: "The Researcher",
    description: "Deep research across the web",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "Claude",
    subtitle: "The Analyst", 
    description: "Critical thinking and analysis",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Sparkles,
    title: "GPT-4",
    subtitle: "The Synthesizer",
    description: "Strategic solution creation",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Grok",
    subtitle: "The Critic",
    description: "Quality control and refinement",
    color: "from-purple-500 to-pink-500"
  }
]

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Chorus Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each AI brings unique expertise to create comprehensive solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-gray-600">
                    {feature.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How it works steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple Process, Powerful Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit Your Problem",
                description: "Simple input, profound output"
              },
              {
                step: "02", 
                title: "4 AIs Collaborate",
                description: "Each brings unique expertise"
              },
              {
                step: "03",
                title: "Get a Battle-Tested Solution",
                description: "Researched, analyzed, refined"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

