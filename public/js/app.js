import { Orchestrator } from './agents/orchestrator.js';
import {
    ResearchAgent, PlanningAgent, CodeGenerationAgent, CodeReviewAgent,
    DebuggingAgent, TestAgent, SecurityAgent, UIUXAgent,
    DatabaseAgent, DeploymentAgent, DocumentationAgent
} from './agents/subagents.js';
import { MemorySystem } from './memory.js';
import { CloudSandbox } from './sandbox.js';

let isProcessing = false;
let orchestrator;
let memory;
let sandbox;

const messagesContainer = document.getElementById('messages');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const exportBtn = document.getElementById('export-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const agentStatusList = document.getElementById('agent-status-list');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded');

  memory = new MemorySystem();
  sandbox = new CloudSandbox();

  // Initialize Orchestrator and Agents
  orchestrator = new Orchestrator();
  orchestrator.registerAgent('Research', new ResearchAgent());
  orchestrator.registerAgent('Planning', new PlanningAgent());
  orchestrator.registerAgent('CodeGeneration', new CodeGenerationAgent());
  orchestrator.registerAgent('CodeReview', new CodeReviewAgent());
  orchestrator.registerAgent('Debugging', new DebuggingAgent());
  orchestrator.registerAgent('Test', new TestAgent());
  orchestrator.registerAgent('Security', new SecurityAgent());
  orchestrator.registerAgent('UIUX', new UIUXAgent());
  orchestrator.registerAgent('Database', new DatabaseAgent());
  orchestrator.registerAgent('Deployment', new DeploymentAgent());
  orchestrator.registerAgent('Documentation', new DocumentationAgent());

  setupAgentStatusList();
  inputForm.addEventListener('submit', handleSubmit);
  if (exportBtn) exportBtn.addEventListener('click', handleExport);

  // Initialize Puter
  try {
    if (typeof puter !== 'undefined') {
        if (puter.auth.isSignedIn()) {
            addMessage('agent', 'System bereit. Angemeldet bei Puter.');
        } else {
            addMessage('agent', 'Bitte melde dich bei Puter an, um den Agenten zu nutzen.');
            await puter.auth.signIn();
        }
    } else {
        addMessage('agent', 'Puter SDK nicht geladen. Demo-Modus eingeschränkt.');
    }
  } catch (e) {
    console.warn("Puter error:", e);
  }
});

async function handleSubmit(e) {
  e.preventDefault();
  
  const request = userInput.value.trim();
  
  if (!request || isProcessing) return;
  
  addMessage('user', request);
  userInput.value = '';
  
  setProcessing(true);
  
  try {
    if (exportBtn) exportBtn.style.display = 'none';
    const result = await orchestrator.process(request);
    addMessage('agent', result);
    
    // Save to memory
    await memory.saveEpisodic(request, result);
    
    // Show files if any were generated
    if (Object.keys(orchestrator.projectData.files).length > 0) {
        let fileList = "\n\n**Generierte Dateien:**\n";
        for (const filename in orchestrator.projectData.files) {
            fileList += `- ${filename}\n`;
        }
        addMessage('agent', fileList);
        if (exportBtn) exportBtn.style.display = 'block';
    }
  } catch (error) {
    addMessage('agent', `Fehler: ${error.message}`);
  } finally {
    setProcessing(false);
  }
}

function addMessage(role, content) {
  const welcome = messagesContainer.querySelector('.welcome');
  if (welcome) welcome.remove();
  
  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  messageEl.innerHTML = `<div style="white-space: pre-wrap;">${escapeHtml(content)}</div>`;
  
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setProcessing(processing) {
  isProcessing = processing;
  userInput.disabled = processing;
  sendBtn.disabled = processing;
  
  btnText.style.display = processing ? 'none' : 'block';
  btnLoader.style.display = processing ? 'block' : 'none';
}

function handleExport() {
    const files = orchestrator.projectData.files;
    let content = "";
    for (const [filename, fileContent] of Object.entries(files)) {
        content += `--- FILE: ${filename} ---\n${fileContent}\n\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_export.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function setupAgentStatusList() {
    const agents = [
        'Project Manager', 'Research', 'Planning', 'CodeGeneration',
        'CodeReview', 'Debugging', 'Test', 'Security', 'UIUX',
        'Database', 'Deployment', 'Documentation'
    ];
    
    if (!agentStatusList) return;
    agentStatusList.innerHTML = '';
    agents.forEach(agent => {
        const statusEl = document.createElement('div');
        statusEl.className = 'status-item';
        statusEl.innerHTML = `
            <span class="status-indicator idle"></span>
            <span>${agent}</span>
        `;
        agentStatusList.appendChild(statusEl);
    });
}

// Listen for agent updates
window.addEventListener('agent-update', (e) => {
    const { agentName, status } = e.detail;
    updateAgentStatusUI(agentName, status);
});

function updateAgentStatusUI(agentName, status) {
    if (!agentStatusList) return;
    const items = agentStatusList.querySelectorAll('.status-item');
    items.forEach(item => {
        if (item.textContent.includes(agentName)) {
            const indicator = item.querySelector('.status-indicator');
            indicator.className = 'status-indicator ' + (status === 'Done' ? 'idle' : 'active');
        }
    });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
