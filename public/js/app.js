// Puter.js Application Logic
const messagesContainer = document.getElementById('messages');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const themeToggle = document.getElementById('theme-toggle');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const uploadPreview = document.getElementById('upload-preview');
const btnLogin = document.getElementById('btn-login');
const userGreeting = document.getElementById('user-greeting');

let selectedFile = null;
let isProcessing = false;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initPuter();
  setupEventListeners();
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.checked = savedTheme === 'dark';

  themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
}

async function initPuter() {
  if (puter.auth.isSignedIn()) {
    const user = await puter.auth.getUser();
    updateUserUI(user);
  }
}

function updateUserUI(user) {
  if (user) {
    userGreeting.textContent = `Hallo, ${user.username}!`;
    btnLogin.textContent = 'Abmelden';
  } else {
    userGreeting.textContent = 'Nicht angemeldet';
    btnLogin.textContent = 'Mit Puter anmelden';
  }
}

function setupEventListeners() {
  btnLogin.addEventListener('click', async () => {
    if (puter.auth.isSignedIn()) {
      puter.auth.signOut();
      updateUserUI(null);
    } else {
      const res = await puter.auth.signIn();
      updateUserUI(res);
    }
  });

  // Drag & Drop
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  inputForm.addEventListener('submit', handleSubmit);
}

// --- File Handling ---
function handleFiles(files) {
  if (files.length === 0) return;

  const file = files[0];
  if (!file.type.startsWith('image/')) {
    alert('Bitte nur Bilder hochladen.');
    return;
  }

  selectedFile = file;
  renderPreview(file);
}

function renderPreview(file) {
  uploadPreview.innerHTML = '';
  const reader = new FileReader();
  reader.onload = (e) => {
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = `
      <img src="${e.target.result}">
      <button class="remove">&times;</button>
    `;
    div.querySelector('.remove').addEventListener('click', () => {
      selectedFile = null;
      uploadPreview.innerHTML = '';
    });
    uploadPreview.appendChild(div);
  };
  reader.readAsDataURL(file);
}

// --- Chat Logic ---
async function handleSubmit(e) {
  e.preventDefault();
  
  const text = userInput.value.trim();
  if ((!text && !selectedFile) || isProcessing) return;

  if (!puter.auth.isSignedIn()) {
    addMessage('agent', 'Bitte melde dich zuerst an, um die AI zu nutzen.');
    return;
  }

  const currentText = text || (selectedFile ? "Bearbeite dieses Bild." : "");
  const currentFile = selectedFile;

  addMessage('user', currentText, currentFile);
  
  // Reset input
  userInput.value = '';
  selectedFile = null;
  uploadPreview.innerHTML = '';
  
  setProcessing(true);
  
  try {
    let result;
    
    if (currentFile) {
      // Wenn ein Bild vorhanden ist, entscheiden wir basierend auf dem Text
      const prompt = currentText.toLowerCase();

      // Schlüsselwörter für Bildbearbeitung (Image-to-Image)
      const editKeywords = ['hintergrund', 'remove', 'entfernen', 'ändern', 'change', 'replace', 'ersetzen', 'hinzufügen', 'add', 'try-on', 'anziehen'];
      const isEditRequest = editKeywords.some(kw => prompt.includes(kw));

      if (isEditRequest) {
         // Bildbearbeitung via Gemini (Image-to-Image)
         result = await handleImageEditing(currentFile, currentText);
      } else {
         // Nur Bild-Analyse / Chat via Vision-Modell
         result = await handleImageChat(currentFile, currentText);
      }
    } else {
      // Nur Text-Chat
      result = await puter.ai.chat(currentText);
    }
    
    if (result instanceof HTMLImageElement) {
      addMessage('agent', 'Hier ist dein bearbeitetes Bild:', result);
    } else if (typeof result === 'string') {
      addMessage('agent', result);
    } else if (result?.message?.content) {
      addMessage('agent', result.message.content);
    } else {
       addMessage('agent', 'Ich konnte die Anfrage leider nicht verarbeiten.');
    }

  } catch (error) {
    console.error(error);
    addMessage('agent', `Fehler: ${error.message || 'Etwas ist schiefgelaufen.'}`);
  } finally {
    setProcessing(false);
  }
}

async function handleImageChat(file, text) {
  // Wir nutzen puter.ai.chat mit Bild-Support
  // Zuerst müssen wir das Bild in Puter FS schreiben, um einen Pfad zu erhalten
  const fileName = `temp_${Date.now()}_${file.name}`;
  await puter.fs.write(fileName, file);

  try {
    const response = await puter.ai.chat(text, fileName);
    // Aufräumen
    puter.fs.delete(fileName);
    return response;
  } catch (err) {
    puter.fs.delete(fileName);
    throw err;
  }
}

async function handleImageEditing(file, text) {
  // Für Bildbearbeitung nutzen wir txt2img im Image-to-Image Modus (falls unterstützt)
  // Oder wir fragen die AI via Chat, was zu tun ist, und nutzen dann txt2img.
  // Hier nutzen wir beispielhaft Gemini für Img2Img via txt2img

  const base64 = await fileToBase64(file);

  return await puter.ai.txt2img(text, {
    model: 'gemini-2.5-flash-image-preview',
    input_image: base64.split(',')[1], // Nur der Base64-Teil
    input_image_mime_type: file.type
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function addMessage(role, content, fileOrImg = null) {
  const welcome = messagesContainer.querySelector('.welcome');
  if (welcome) welcome.remove();
  
  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  
  const textDiv = document.createElement('div');
  textDiv.style.whiteSpace = 'pre-wrap';
  textDiv.textContent = content;
  messageEl.appendChild(textDiv);
  
  if (fileOrImg) {
    if (fileOrImg instanceof File) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(fileOrImg);
      messageEl.appendChild(img);
    } else if (fileOrImg instanceof HTMLImageElement) {
      messageEl.appendChild(fileOrImg);

      // Download Button
      const actions = document.createElement('div');
      actions.className = 'image-actions';
      const dlLink = document.createElement('a');
      dlLink.href = fileOrImg.src;
      dlLink.download = `edited_image_${Date.now()}.png`;
      dlLink.className = 'btn-download';
      dlLink.innerHTML = '📥 Download';
      actions.appendChild(dlLink);
      messageEl.appendChild(actions);
    }
  }

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
