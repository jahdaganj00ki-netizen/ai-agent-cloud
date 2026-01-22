const API_BASE = window.location.origin + '/api';

let isProcessing = false;

const messagesContainer = document.getElementById('messages');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const agentStatusList = document.getElementById('agent-status-list');

document.addEventListener('DOMContentLoaded', () => {
  loadAgentStatuses();
  inputForm.addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
  e.preventDefault();
  
  const request = userInput.value.trim();
  
  if (!request || isProcessing) return;
  
  addMessage('user', request);
  userInput.value = '';
  
  setProcessing(true);
  addProcessingMessage();
  
  try {
    const response = await fetch(`${API_BASE}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request }),
    });
    
    const data = await response.json();
    
    removeProcessingMessage();
    
    if (data.success) {
      addMessage('agent', data.result);
    } else {
      addMessage('agent', `Fehler: ${data.error}`);
    }
  } catch (error) {
    removeProcessingMessage();
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
  
  // Use textContent for security and performance (avoids HTML parsing)
  const contentEl = document.createElement('div');
  contentEl.style.whiteSpace = 'pre-wrap';
  contentEl.textContent = content;

  messageEl.appendChild(contentEl);
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addProcessingMessage() {
  const processingEl = document.createElement('div');
  processingEl.className = 'message agent';
  processingEl.id = 'processing-message';

  // Use createElement instead of innerHTML to avoid parsing overhead
  const loaderEl = document.createElement('div');
  loaderEl.className = 'loader';

  const textEl = document.createTextNode(' Verarbeite...');

  processingEl.appendChild(loaderEl);
  processingEl.appendChild(textEl);
  
  messagesContainer.appendChild(processingEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeProcessingMessage() {
  const processingEl = document.getElementById('processing-message');
  if (processingEl) processingEl.remove();
}

function setProcessing(processing) {
  isProcessing = processing;
  userInput.disabled = processing;
  sendBtn.disabled = processing;
  
  btnText.style.display = processing ? 'none' : 'block';
  btnLoader.style.display = processing ? 'block' : 'none';
}

async function loadAgentStatuses() {
  try {
    const response = await fetch(`${API_BASE}/agent-statuses`);
    const statuses = await response.json();
    
    // Optimization: Use DocumentFragment to batch DOM updates and minimize layout reflows
    const fragment = document.createDocumentFragment();

    for (const [type, status] of Object.entries(statuses)) {
      const statusEl = document.createElement('div');
      statusEl.className = 'status-item';

      const indicator = document.createElement('span');
      indicator.className = `status-indicator ${status}`;

      const name = document.createElement('span');
      name.textContent = formatAgentName(type);

      statusEl.appendChild(indicator);
      statusEl.appendChild(name);
      fragment.appendChild(statusEl);
    }

    agentStatusList.textContent = ''; // Clear existing content efficiently
    agentStatusList.appendChild(fragment);
  } catch (error) {
    console.error('Failed to load statuses:', error);
  }
}

function formatAgentName(type) {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
