'use client'

import { useTestScenarioStore } from '@/lib/stores/test-scenario-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function TestScenarioPanel() {
  const { scenario, updateScenario } = useTestScenarioStore()

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-white">Test Scenarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-300">Latency (ms)</Label>
          <Slider
            value={[scenario.latency]}
            onValueChange={([value]) => updateScenario({ latency: value })}
            max={5000}
            step={100}
            className="w-full"
          />
          <div className="text-sm text-gray-400">{scenario.latency}ms</div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Server Outage</Label>
          <Switch
            checked={scenario.serverOutage}
            onCheckedChange={(checked) => updateScenario({ serverOutage: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Random Failures</Label>
          <Switch
            checked={scenario.randomFailures}
            onCheckedChange={(checked) =>
              updateScenario({ randomFailures: checked })
            }
          />
        </div>

        {scenario.randomFailures && (
          <div className="space-y-2">
            <Label className="text-gray-300">Failure Rate</Label>
            <Slider
              value={[scenario.failureRate * 100]}
              onValueChange={([value]) =>
                updateScenario({ failureRate: value / 100 })
              }
              max={100}
              step={5}
              className="w-full"
            />
            <div className="text-sm text-gray-400">
              {(scenario.failureRate * 100).toFixed(0)}%
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Pagination Stress Test</Label>
          <Switch
            checked={scenario.paginationStress}
            onCheckedChange={(checked) =>
              updateScenario({ paginationStress: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

