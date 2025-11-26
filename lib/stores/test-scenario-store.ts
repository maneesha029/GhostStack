import { create } from 'zustand'

export interface TestScenario {
  latency: number // ms
  serverOutage: boolean
  randomFailures: boolean
  failureRate: number // 0-1
  paginationStress: boolean
}

interface TestScenarioState {
  scenario: TestScenario
  updateScenario: (updates: Partial<TestScenario>) => void
  resetScenario: () => void
}

const defaultScenario: TestScenario = {
  latency: 0,
  serverOutage: false,
  randomFailures: false,
  failureRate: 0.1,
  paginationStress: false,
}

export const useTestScenarioStore = create<TestScenarioState>((set) => ({
  scenario: defaultScenario,
  updateScenario: (updates) =>
    set((state) => ({
      scenario: { ...state.scenario, ...updates },
    })),
  resetScenario: () => set({ scenario: defaultScenario }),
}))

