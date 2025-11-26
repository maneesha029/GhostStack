'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Briefcase, Github, Upload, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'

type Persona = 'student' | 'professional' | null
type Step = 'persona' | 'input' | 'scanning'

export function OnboardingFlow() {
  const [persona, setPersona] = useState<Persona>(null)
  const [step, setStep] = useState<Step>('persona')
  const [repoUrl, setRepoUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const router = useRouter()
  const { setCurrentProject, updateFile } = useWorkspaceStore()

  const handlePersonaSelect = (selected: Persona) => {
    setPersona(selected)
    setTimeout(() => setStep('input'), 300)
  }

  const handleScan = async () => {
    if (!repoUrl.trim()) return

    setIsScanning(true)
    setStep('scanning')

    try {
      const response = await fetch('/api/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      })

      const data = await response.json()

      if (data.success) {
        // Generate mock server
        const mockResponse = await fetch('/api/generate-mock-server', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scannedRepo: data.data }),
        })

        const mockData = await mockResponse.json()

        if (mockData.success) {
          // Set up workspace
          setCurrentProject('project-1')
          updateFile('ghost-server/index.js', mockData.code)
          updateFile('README.md', '# GhostStack Project\n\nGenerated mock server')

          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Error scanning repo:', error)
      setIsScanning(false)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {step === 'persona' && (
          <motion.div
            key="persona"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Choose Your Persona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  This helps the AI mentor tailor its guidance to your experience level.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => handlePersonaSelect('student')}
                    className="group rounded-xl border-2 border-gray-800 bg-gray-800/50 p-6 text-left transition-all hover:border-purple-600 hover:bg-gray-800"
                  >
                    <GraduationCap className="mb-3 h-8 w-8 text-purple-600" />
                    <h3 className="mb-2 font-semibold text-white">Student Mode</h3>
                    <p className="text-sm text-gray-400">
                      More explanations, beginner-friendly guidance, step-by-step walkthroughs.
                    </p>
                  </button>
                  <button
                    onClick={() => handlePersonaSelect('professional')}
                    className="group rounded-xl border-2 border-gray-800 bg-gray-800/50 p-6 text-left transition-all hover:border-purple-600 hover:bg-gray-800"
                  >
                    <Briefcase className="mb-3 h-8 w-8 text-purple-600" />
                    <h3 className="mb-2 font-semibold text-white">Professional Mode</h3>
                    <p className="text-sm text-gray-400">
                      Architectural guidance, concise suggestions, production-focused advice.
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Provide Your Repository</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">Or</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-gray-700"
                  onClick={() => {
                    // File upload would go here
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload ZIP File
                </Button>
                <Button
                  onClick={handleScan}
                  disabled={!repoUrl.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Scan Repository
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Scanning Repository</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                </div>
                <p className="text-center text-sm text-gray-400">
                  Analyzing your codebase and generating mock APIs...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

