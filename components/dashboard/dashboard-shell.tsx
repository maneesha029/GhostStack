'use client'

import { useState } from 'react'
import { WebContainerIDE } from '@/components/ide/webcontainer-ide'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { MentorChatbot } from '@/components/mentor/mentor-chatbot'
import { TestScenarioPanel } from '@/components/test-scenarios/test-scenario-panel'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { Button } from '@/components/ui/button'
import { FileText, Folder, Settings, Home } from 'lucide-react'

export function DashboardShell() {
  const { files, setActiveFile, currentProject } = useWorkspaceStore()
  const [showTestPanel, setShowTestPanel] = useState(false)
  const [view, setView] = useState<'overview' | 'ide'>(
    currentProject ? 'ide' : 'overview'
  )

  const fileList = Object.keys(files)
  const hasProject = currentProject && fileList.length > 0

  if (view === 'overview' || !hasProject) {
    return (
      <div className="min-h-screen bg-gray-950">
        <DashboardOverview />
        <MentorChatbot />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('overview')}
              className="text-gray-400 hover:text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <h1 className="text-xl font-semibold text-white">GhostStack IDE</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Server Running
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestPanel(!showTestPanel)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Test Scenarios
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-800 bg-gray-900 p-4">
          <div className="mb-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-400">Files</h2>
            <div className="space-y-1">
              {fileList.length === 0 ? (
                <div className="text-sm text-gray-500">No files yet</div>
              ) : (
                fileList.map((file) => (
                  <button
                    key={file}
                    onClick={() => setActiveFile(file)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    <FileText className="h-4 w-4" />
                    {file}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-400">
              ghost-server/
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300">
                <Folder className="h-4 w-4" />
                mock-routes.js
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <WebContainerIDE />
        </main>

        {showTestPanel && (
          <aside className="w-80 border-l border-gray-800 bg-gray-900 p-4">
            <TestScenarioPanel />
          </aside>
        )}
      </div>

      <MentorChatbot />
    </div>
  )
}

