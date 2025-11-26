import { create } from 'zustand'

interface WorkspaceState {
  currentProject: string | null
  isServerRunning: boolean
  serverPort: number | null
  activeFile: string | null
  files: Record<string, string>
  setCurrentProject: (projectId: string | null) => void
  setServerRunning: (running: boolean) => void
  setServerPort: (port: number | null) => void
  setActiveFile: (file: string | null) => void
  updateFile: (path: string, content: string) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentProject: null,
  isServerRunning: false,
  serverPort: null,
  activeFile: null,
  files: {},
  setCurrentProject: (projectId) => set({ currentProject: projectId }),
  setServerRunning: (running) => set({ isServerRunning: running }),
  setServerPort: (port) => set({ serverPort: port }),
  setActiveFile: (file) => set({ activeFile: file }),
  updateFile: (path, content) =>
    set((state) => ({
      files: { ...state.files, [path]: content },
    })),
  reset: () =>
    set({
      currentProject: null,
      isServerRunning: false,
      serverPort: null,
      activeFile: null,
      files: {},
    }),
}))

