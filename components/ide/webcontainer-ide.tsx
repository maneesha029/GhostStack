'use client'

import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from './monaco-editor'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { Button } from '@/components/ui/button'
import { Play, Square } from 'lucide-react'

export function WebContainerIDE() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const previewRef = useRef<HTMLIFrameElement>(null)
  const { activeFile, files, updateFile } = useWorkspaceStore()

  const handleRun = async () => {
    setIsRunning(true)
    setLogs((prev) => [...prev, 'Starting server...'])

    // WebContainer implementation would go here
    // For now, simulate with timeout
    setTimeout(() => {
      setLogs((prev) => [...prev, 'Server running on http://localhost:3001'])
      setIsRunning(true)
    }, 1000)
  }

  const handleStop = () => {
    setIsRunning(false)
    setLogs((prev) => [...prev, 'Server stopped'])
  }

  const currentContent = activeFile ? files[activeFile] || '' : ''

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 p-2">
            <span className="text-sm text-gray-400">
              {activeFile || 'No file selected'}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={isRunning ? handleStop : handleRun}
                variant={isRunning ? 'destructive' : 'default'}
              >
                {isRunning ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              value={currentContent}
              language="typescript"
              onChange={(value) => {
                if (activeFile) {
                  updateFile(activeFile, value)
                }
              }}
              path={activeFile || undefined}
            />
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          <div className="border-b border-gray-800 p-2">
            <span className="text-sm text-gray-400">Preview</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              ref={previewRef}
              src={isRunning ? 'http://localhost:3001' : undefined}
              className="h-full w-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>

      <div className="h-48 border-t border-gray-800 bg-gray-950 p-4">
        <div className="mb-2 text-sm font-semibold text-gray-400">
          Terminal / Logs
        </div>
        <div className="h-full overflow-y-auto font-mono text-xs text-gray-300">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

