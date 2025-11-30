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
    const sampleData = generateSampleData(endpoint.responseSchema || {}, endpoint.path)
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

function generateSampleData(schema: Record<string, any>, context?: string): any {
  if (Array.isArray(schema)) {
    return schema.map((item) => generateSampleData(item, context))
  }

  if (typeof schema === 'object' && schema !== null && Object.keys(schema).length > 0) {
    const data: any = {}
    for (const [key, value] of Object.entries(schema)) {
      if (typeof value === 'string') {
        data[key] = getSampleValue(value)
      } else if (typeof value === 'object') {
        data[key] = generateSampleData(value, context)
      }
    }
    return data
  }

  // Return realistic context-based data if schema is empty
  if (context) {
    return generateContextualData(context)
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

function generateContextualData(path: string): any {
  const pathLower = path.toLowerCase()

  // Image processing endpoints
  if (pathLower.includes('upload')) {
    return {
      fileId: 'file_' + Math.random().toString(36).substr(2, 9),
      fileName: 'image.webp',
      size: 1024 * 512,
      uploadedAt: new Date().toISOString(),
      status: 'success',
    }
  }

  if (pathLower.includes('upscale')) {
    return {
      originalUrl: 'https://cdn.example.com/original.webp',
      upscaledUrl: 'https://cdn.example.com/upscaled.webp',
      scale: 4,
      processingTime: 1250,
      status: 'completed',
    }
  }

  if (pathLower.includes('webp-to-mp4')) {
    return {
      videoUrl: 'https://cdn.example.com/animation.mp4',
      duration: 5.2,
      format: 'mp4',
      resolution: '1280x720',
      fileSize: 2048576,
      status: 'ready',
    }
  }

  if (pathLower.includes('webp-to-png')) {
    return {
      imageUrl: 'https://cdn.example.com/converted.png',
      originalFormat: 'webp',
      newFormat: 'png',
      width: 1920,
      height: 1080,
      status: 'converted',
    }
  }

  // Default response
  return {
    data: 'Sample response',
    status: 'success',
    timestamp: new Date().toISOString(),
  }
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

// Disable Express's automatic trailing slash redirect
app.set('strict routing', false);

// Configuration for latency and error simulation
const LATENCY = ${config.latency || 0}; // milliseconds
const ERROR_RATE = ${config.errorRate || 0}; // decimal (0-1)

// Middleware to apply latency and error simulation
app.use((req, res, next) => {
  if (LATENCY > 0) {
    setTimeout(next, LATENCY);
  } else {
    next();
  }
});

// Middleware to randomly simulate errors based on ERROR_RATE
app.use((req, res, next) => {
  if (ERROR_RATE > 0 && Math.random() < ERROR_RATE) {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      timestamp: new Date().toISOString(),
      simulated: true,
    });
  }
  next();
});

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
  ${config.latency ? `console.log(\`Latency: \${LATENCY}ms per request\`);` : ''}
  ${config.errorRate ? `console.log(\`Error rate: \${(ERROR_RATE * 100).toFixed(1)}%\`);` : ''}
});
`.trim()
}

