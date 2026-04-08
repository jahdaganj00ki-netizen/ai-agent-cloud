const API_BASE = window.location.origin + '/api';

let isProcessing = false;

const messagesContainer = document.getElementById('messages');
let scrollPending = false;

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
 * Throttled scroll to bottom using requestAnimationFrame to prevent layout thrashing
 * during rapid message updates.
 */
function scrollToBottom() {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    scrollPending = false;
  });
}

function addMessage(role, content) {
  const welcome = messagesContainer.querySelector('.welcome');
  if (welcome) welcome.remove();
  
  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  
  // Performance & Security: Using textContent directly instead of innerHTML + escapeHtml
  const contentEl = document.createElement('div');
  contentEl.style.whiteSpace = 'pre-wrap';
  contentEl.textContent = content;

  messageEl.appendChild(contentEl);
  messagesContainer.appendChild(messageEl);
  scrollToBottom();
}

function addProcessingMessage() {
  const processingEl = document.createElement('div');
  processingEl.className = 'message agent';
  processingEl.id = 'processing-message';
  processingEl.innerHTML = '<div class="loader"></div> Verarbeite...';
  
  messagesContainer.appendChild(processingEl);
  scrollToBottom();
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
 * Loads agent statuses and updates the DOM using a DocumentFragment
 * to minimize reflows.
 */
async function loadAgentStatuses() {
  try {
    const response = await fetch(`${API_BASE}/agent-statuses`);
    const statuses = await response.json();
    
    const fragment = document.createDocumentFragment();
    for (const [type, status] of Object.entries(statuses)) {
      const statusEl = document.createElement('div');
      statusEl.className = 'status-item';
      statusEl.innerHTML = `
        <span class="status-indicator ${status}"></span>
        <span>${formatAgentName(type)}</span>
      `;
      fragment.appendChild(statusEl);
    }

    agentStatusList.innerHTML = '';
    agentStatusList.appendChild(fragment);
  } catch (error) {
    console.error('Failed to load statuses:', error);
  }
}

function formatAgentName(type) {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
