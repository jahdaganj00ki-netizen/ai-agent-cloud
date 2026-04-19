import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

export function startServer(): Promise<number> {
  const PORT = process.env.PORT || 0; // Use random port if 0 or not set
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      const address = server.address();
      const actualPort = typeof address === 'string' ? 0 : address?.port || 3000;
      console.log(`🚀 AI Coding Agent server running on port ${actualPort}`);
      resolve(actualPort);
    });
  });
}

// Simple demo response (MVP)
app.post('/api/process', async (req, res) => {
  const { request } = req.body;
  res.json({ success: true, result: "Deprecated. Use Puter.js in frontend." });
});

// Agent statuses
app.get('/api/agent-statuses', (req, res) => {
  res.json({
    project_manager: 'idle',
    planning: 'idle',
    code_generation: 'idle',
    code_review: 'idle',
    debugging: 'idle'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
