const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Disable Express's automatic trailing slash redirect
app.set('strict routing', false);

// Configuration for latency and error simulation
const LATENCY = 0; // milliseconds
const ERROR_RATE = 0; // decimal (0-1)

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

// Helper function to generate contextual sample data
function getContextualResponse(path) {
  const pathLower = path.toLowerCase();

  if (pathLower.includes('webp-to-mp4')) {
    return {
      videoUrl: 'https://cdn.example.com/animation.mp4',
      duration: 5.2,
      format: 'mp4',
      resolution: '1280x720',
      fileSize: 2048576,
      status: 'ready',
    };
  }

  if (pathLower.includes('webp-to-png')) {
    return {
      imageUrl: 'https://cdn.example.com/converted.png',
      originalFormat: 'webp',
      newFormat: 'png',
      width: 1920,
      height: 1080,
      status: 'converted',
    };
  }

  if (pathLower.includes('upload') && pathLower.includes('v1')) {
    return {
      fileId: 'file_' + Math.random().toString(36).substr(2, 9),
      fileName: 'image.webp',
      size: 524288,
      uploadedAt: new Date().toISOString(),
      status: 'success',
    };
  }

  if (pathLower.includes('upscale')) {
    return {
      originalUrl: 'https://cdn.example.com/original.webp',
      upscaledUrl: 'https://cdn.example.com/upscaled.webp',
      scale: 4,
      processingTime: 1250,
      status: 'completed',
    };
  }

  if (pathLower.includes('upload')) {
    return {
      fileId: 'file_' + Math.random().toString(36).substr(2, 9),
      fileName: 'image.webp',
      size: 524288,
      uploadedAt: new Date().toISOString(),
      status: 'success',
    };
  }

  return {
    data: 'Sample response',
    status: 'success',
    timestamp: new Date().toISOString(),
  };
}

app.post('/', async (req, res) => {
  res.json(getContextualResponse('/?expires=1d'));
});

app.post('/upload', async (req, res) => {
  res.json(getContextualResponse('/upload'));
});

app.post('/v1/upload', async (req, res) => {
  res.json(getContextualResponse('/v1/upload'));
});

app.post('/v1/upscale', async (req, res) => {
  res.json(getContextualResponse('/v1/upscale'));
});

app.post('/webp-to-mp4', async (req, res) => {
  res.json(getContextualResponse('/webp-to-mp4'));
});

app.get('/webp-to-mp4/', async (req, res) => {
  res.json(getContextualResponse('/webp-to-mp4/'));
});

app.post('/webp-to-png', async (req, res) => {
  res.json(getContextualResponse('/webp-to-png'));
});

app.get('/webp-to-png/', async (req, res) => {
  res.json(getContextualResponse('/webp-to-png/'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  if (LATENCY > 0) console.log(`Latency: ${LATENCY}ms per request`);
  if (ERROR_RATE > 0) console.log(`Error rate: ${(ERROR_RATE * 100).toFixed(1)}%`);
});
