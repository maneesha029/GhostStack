'use client'

import { motion } from 'framer-motion'
import { MockCraftChat } from './mockcraft-chat'
import { ThreeBackground } from './three-background'

export function MockCraftPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <ThreeBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl h-[90vh] md:h-[80vh]"
      >
        <MockCraftChat />
      </motion.div>
    </div>
  )
}

