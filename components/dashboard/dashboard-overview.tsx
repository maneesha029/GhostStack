'use client'

import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import {
  Github,
  FolderOpen,
  BookOpen,
  MessageCircle,
  Code,
  Zap,
  Server,
  Brain,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'

export function DashboardOverview() {
  const router = useRouter()
  const { setCurrentProject } = useWorkspaceStore()

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Welcome to GhostStack</h1>
        <p className="text-gray-400">
          Your intelligent reverse engineering IDE. Choose an action to get started.
        </p>
      </div>

      <BentoGrid className="max-w-7xl">
        <BentoCard
          name="Scan My Repo"
          description="Upload a GitHub repository or ZIP file to automatically generate mock APIs"
          icon={<Github className="h-5 w-5" />}
          onClick={() => router.push('/onboarding')}
          className="md:col-span-2"
        >
          <div className="mt-4 flex items-center gap-2 text-xs text-purple-400">
            <Zap className="h-3 w-3" />
            Auto-detect endpoints, interfaces, and API calls
          </div>
        </BentoCard>

        <BentoCard
          name="Open Last Workspace"
          description="Continue where you left off"
          icon={<FolderOpen className="h-5 w-5" />}
          onClick={() => {
            setCurrentProject('last-project')
            // Trigger a page refresh to show IDE view
            window.location.href = '/dashboard'
          }}
        />

        <BentoCard
          name="View Tutorials"
          description="Learn how to use GhostStack effectively"
          icon={<BookOpen className="h-5 w-5" />}
          onClick={() => {
            // Open tutorials modal or page
          }}
        />

        <BentoCard
          name="Access AI Mentor"
          description="Get real-time guidance and code suggestions"
          icon={<Brain className="h-5 w-5" />}
          onClick={() => {
            // Open mentor chat
          }}
          className="md:col-span-2"
        >
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MessageCircle className="h-3 w-3" />
              Context-aware suggestions
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Code className="h-3 w-3" />
              Auto-patch functionality
            </div>
          </div>
        </BentoCard>

        <BentoCard
          name="API Schema Viewer"
          description="Explore generated API endpoints and schemas"
          icon={<Server className="h-5 w-5" />}
          onClick={() => {
            // Open schema viewer
          }}
        />

        <BentoCard
          name="Test Scenarios"
          description="Simulate latency, failures, and edge cases"
          icon={<Zap className="h-5 w-5" />}
          onClick={() => {
            // Open test scenarios
          }}
        />

        <BentoCard
          name="MockCraft AI"
          description="Interactive mock server generator with AI assistance"
          icon={<Sparkles className="h-5 w-5" />}
          onClick={() => router.push('/mockcraft')}
          className="md:col-span-2"
        >
          <div className="mt-4 flex items-center gap-2 text-xs text-purple-400">
            <Zap className="h-3 w-3" />
            Upload API schemas, generate mocks, and test endpoints
          </div>
        </BentoCard>

        <BentoCard
          name="Quick Start"
          description="Start with a template project"
          icon={<Code className="h-5 w-5" />}
          onClick={() => {
            // Create template project
          }}
        >
          <div className="mt-4 text-xs text-gray-400">
            Choose from React, Vue, Next.js templates
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  )
}

