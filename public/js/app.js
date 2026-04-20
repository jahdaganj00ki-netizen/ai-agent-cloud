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

/**
 * Adds a message to the chat container.
 * Optimized to use textContent and avoid HTML parsing for better performance and security.
 */
function addMessage(role, content) {
  const welcome = messagesContainer.querySelector('.welcome');
  if (welcome) welcome.remove();
  
  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  
  const textContainer = document.createElement('div');
  textContainer.style.whiteSpace = 'pre-wrap';
  textContainer.textContent = content;

  messageEl.appendChild(textContainer);
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Adds a processing indicator message.
 * Optimized using direct DOM creation.
 */
function addProcessingMessage() {
  const processingEl = document.createElement('div');
  processingEl.className = 'message agent';
  processingEl.id = 'processing-message';

  const loader = document.createElement('div');
  loader.className = 'loader';

  const text = document.createTextNode(' Verarbeite...');

  processingEl.appendChild(loader);
  processingEl.appendChild(text);
  
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

/**
 * Loads agent statuses and updates the UI.
 * Optimized using DocumentFragment to minimize layout reflows and textContent for security.
 */
async function loadAgentStatuses() {
  try {
    const response = await fetch(`${API_BASE}/agent-statuses`);
    const statuses = await response.json();
    
    const fragment = document.createDocumentFragment();
    for (const [type, status] of Object.entries(statuses)) {
      const statusEl = document.createElement('div');
      statusEl.className = 'status-item';

      const indicator = document.createElement('span');
      indicator.className = `status-indicator ${status}`;

      const name = document.createElement('span');
      name.textContent = formatAgentName(type);

      statusEl.appendChild(indicator);
      statusEl.appendChild(document.createTextNode(' '));
      statusEl.appendChild(name);
      fragment.appendChild(statusEl);
    }

    agentStatusList.textContent = ''; // Clear existing
    agentStatusList.appendChild(fragment);
  } catch (error) {
    console.error('Failed to load statuses:', error);
  }
}

function formatAgentName(type) {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
