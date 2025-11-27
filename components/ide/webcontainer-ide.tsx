'use client'

import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from './monaco-editor'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { Button } from '@/components/ui/button'
import { Play, Square, ExternalLink, Copy, Check } from 'lucide-react'

export function WebContainerIDE() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const { activeFile, files, updateFile } = useWorkspaceStore()
  const [copiedRoute, setCopiedRoute] = useState<string | null>(null)

  // Extract API routes from the mock server code
  const extractRoutes = (code: string) => {
    const routes: Array<{ method: string; path: string; handler: string }> = []
    const routeRegex = /app\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/gi
    let match
    while ((match = routeRegex.exec(code)) !== null) {
      routes.push({
        method: match[1].toUpperCase(),
        path: match[2],
        handler: '',
      })
    }
    return routes
  }

  const mockServerCode = files['ghost-server/index.js'] || ''
  const routes = extractRoutes(mockServerCode)

  const handleRun = async () => {
    setIsRunning(true)
    setLogs([])
    setLogs((prev) => [...prev, '[ghost-server] Bootstrapping mock server...'])
    
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        '[ghost-server] Installing dependencies...',
        '[ghost-server] ✓ express@4.18.2 installed',
        '[ghost-server] ✓ cors@2.8.5 installed',
      ])
    }, 500)

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[ghost-server] Detected ${routes.length} API endpoint(s)`,
        '[ghost-server] Synthesizing sample payloads...',
        '[ghost-server] Generating mock responses...',
      ])
    }, 1200)

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[ghost-server] Mock server ready on port 3001`,
        '[ghost-server] ✓ Server running',
        '[ghost-server] Listening on http://localhost:3001',
      ])
    }, 2000)
  }

  const handleStop = () => {
    setIsRunning(false)
    setLogs((prev) => [...prev, '[ghost-server] Server stopped'])
  }

  const copyToClipboard = (text: string, route: string) => {
    navigator.clipboard.writeText(text)
    setCopiedRoute(route)
    setTimeout(() => setCopiedRoute(null), 2000)
  }

  const currentContent = activeFile ? files[activeFile] || '' : ''

  const getSampleResponse = (method: string, path: string) => {
    if (path.includes('users')) {
      if (method === 'GET') {
        return {
          users: [
            { id: '1', name: 'John Doe', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          ],
        }
      } else if (method === 'POST') {
        return { id: '3', name: 'New User', email: 'new@example.com', created: true }
      }
    }
    return { data: 'Sample response', status: 'success', timestamp: new Date().toISOString() }
  }

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
              language="javascript"
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
            <span className="text-sm text-gray-400">API Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-950 p-4">
            {!isRunning ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Play className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                  <p className="mb-2 text-sm font-medium text-gray-400">
                    Click "Run" to start the mock server
                  </p>
                  <p className="text-xs text-gray-500">
                    Preview will show available API endpoints
                  </p>
                </div>
              </div>
            ) : routes.length > 0 ? (
              <div className="space-y-4">
                <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-sm font-semibold text-green-400">
                      ✓ Mock Server Running
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {routes.length} endpoint(s) available on port 3001
                  </p>
                </div>
                {routes.map((route, idx) => {
                  const sampleResponse = getSampleResponse(route.method, route.path)
                  const fetchCode = `fetch('http://localhost:3001${route.path}', {
  method: '${route.method}',
  headers: { 'Content-Type': 'application/json' }
})`
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-800 bg-gray-900 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-1 text-xs font-mono font-semibold ${
                              route.method === 'GET'
                                ? 'bg-blue-500/20 text-blue-400'
                                : route.method === 'POST'
                                ? 'bg-green-500/20 text-green-400'
                                : route.method === 'PUT'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : route.method === 'DELETE'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {route.method}
                          </span>
                          <code className="text-sm text-gray-300">{route.path}</code>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(fetchCode, `${route.method}-${route.path}`)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedRoute === `${route.method}-${route.path}` ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="mb-3 rounded bg-gray-800 p-3">
                        <p className="mb-2 text-xs font-medium text-gray-400">Sample Response:</p>
                        <pre className="overflow-x-auto text-xs text-gray-300">
                          {JSON.stringify(sampleResponse, null, 2)}
                        </pre>
                      </div>
                      <div className="rounded bg-gray-800 p-3">
                        <p className="mb-2 text-xs font-medium text-gray-400">Fetch Example:</p>
                        <code className="block overflow-x-auto text-xs text-gray-300">
                          {fetchCode}
                        </code>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-400">
                  No routes detected in mock server code
                </p>
              </div>
            )}
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
