import { ApiEndpoint, ScannedRepo } from '@/lib/repo-scanner'

export interface MockRoute {
  method: string
  path: string
  handler: string
  sampleData: any
}

export interface MockServerConfig {
  routes: MockRoute[]
  port: number
  latency?: number
  errorRate?: number
}

export function generateMockServer(
  scannedRepo: ScannedRepo,
  testScenario?: {
    latency?: number
    errorRate?: number
  }
): MockServerConfig {
  const routes: MockRoute[] = scannedRepo.endpoints.map((endpoint) => {
    const sampleData = generateSampleData(endpoint.responseSchema || {})
    const handler = generateHandler(endpoint, sampleData, testScenario)

    return {
      method: endpoint.method,
      path: endpoint.path,
      handler,
      sampleData,
    }
  })

  return {
    routes,
    port: 3001,
    latency: testScenario?.latency || 0,
    errorRate: testScenario?.errorRate || 0,
  }
}

function generateSampleData(schema: Record<string, any>): any {
  if (Array.isArray(schema)) {
    return schema.map((item) => generateSampleData(item))
  }

  if (typeof schema === 'object' && schema !== null) {
    const data: any = {}
    for (const [key, value] of Object.entries(schema)) {
      if (typeof value === 'string') {
        data[key] = getSampleValue(value)
      } else if (typeof value === 'object') {
        data[key] = generateSampleData(value)
      }
    }
    return data
  }

  return schema
}

function getSampleValue(type: string): any {
  const samples: Record<string, any> = {
    string: 'sample',
    number: 42,
    boolean: true,
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    name: 'John Doe',
  }

  return samples[type] || 'sample'
}

function generateHandler(
  endpoint: ApiEndpoint,
  sampleData: any,
  testScenario?: { latency?: number; errorRate?: number }
): string {
  const latency = testScenario?.latency || 0
  const errorRate = testScenario?.errorRate || 0

  return `
    async (req, res) => {
      ${latency > 0 ? `await new Promise(resolve => setTimeout(resolve, ${latency}));` : ''}
      
      ${errorRate > 0 ? `
        if (Math.random() < ${errorRate}) {
          return res.status(500).json({ error: 'Random failure' });
        }
      ` : ''}

      if (req.method === '${endpoint.method}') {
        res.json(${JSON.stringify(sampleData, null, 2)});
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    }
  `.trim()
}

export function generateMockServerCode(config: MockServerConfig): string {
  return `
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

${config.routes
  .map(
    (route) => `
app.${route.method.toLowerCase()}('${route.path}', ${route.handler});
`
  )
  .join('\n')}

const PORT = ${config.port};
app.listen(PORT, () => {
  console.log(\`Mock server running on http://localhost:\${PORT}\`);
});
`.trim()
}

