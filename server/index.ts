import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Simple demo response (MVP)
app.post('/api/process', async (req, res) => {
  const { request } = req.body;
  
  // Simulate agent processing
  const response = `# AI Coding Agent Response

**Your Request:** ${request}

**Analysis:**
This is a demo response. The full agent system with Puter.js integration will process your request using:

1. **Project Manager Agent** - Analyzing your request
2. **Planning Agent** - Creating implementation plan
3. **Code Generation Agent** - Writing code
4. **Code Review Agent** - Reviewing quality
5. **Debugging Agent** - Ensuring correctness

**Next Steps:**
- Add Puter.js API integration
- Implement full agent orchestration
- Add memory system

**Status:** Demo Mode - Full system coming soon!`;

  res.json({ success: true, result: response });
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

app.listen(PORT, () => {
  console.log(`🚀 AI Coding Agent running on port ${PORT}`);
});
