/**
 * ============================
 * SCRIPT PRINCIPAL DO MODELO DE RESUMOS MÉDICOS
 * ============================
 */

// ============================
// CONFIGURAÇÕES GLOBAIS
// ============================

const CONFIG = {
  WPM: 150,
  MOBILE_BREAKPOINT: 768,
  SCROLL_THROTTLE: 16,
  SIDEBAR_ANIMATION_DURATION: 300
};

// ============================
// PERGUNTAS PRÉ-FORMULADAS
// ============================

const PREDEFINED_QUESTIONS = [
  { short: "Explique de forma simples para uma criança de 10 anos", detailed: "Explique este conteúdo médico como se estivesse ensinando a uma criança de 10 anos, usando analogias simples, mantendo os conceitos corretos, de forma extremamente clara e didática. Foque na compreensão básica sem jargão técnico." },
  { short: "Resuma em um parágrafo (nível doutorado)", detailed: "Explique este conteúdo médico em um único parágrafo como resumo de aula de doutorado. Inclua pontos essenciais de fisiopatologia, epidemiologia, manifestações clínicas, diagnóstico diferencial, exames relevantes, tratamento ou prognóstico. Ressalte aspectos práticos e correlações anatômicas ou clínicas importantes." },
  { short: "Explique o conteúdo completo detalhado (nível doutorado)", detailed: "Explique este conteúdo médico detalhadamente, como em uma aula de doutorado. Inclua fisiopatologia, epidemiologia, manifestações clínicas, diagnóstico diferencial, exames laboratoriais e de imagem, tratamento, prognóstico e condutas práticas. Faça correlações anatômicas, fisiológicas ou clínicas quando relevante, priorizando informações práticas e objetivas." },
  { short: "Crie um caso clínico real baseado neste conteúdo", detailed: "Com base neste conteúdo médico, crie um caso clínico realista, incluindo história clínica, exame físico e resultados laboratoriais/exames de imagem relevantes. Destaque pontos importantes para tomada de decisão, diagnóstico e manejo, de forma educativa, sem fornecer respostas prontas." },
  { short: "Faça um resumo objetivo para estudo prático", detailed: "Faça um resumo conciso do conteúdo médico, destacando sinais e sintomas chave, condutas iniciais, exames relevantes ou conceitos importantes para tomada de decisão clínica rápida, conforme o contexto apresentado." },
  { short: "Mostre a aplicação prática clínica do conteúdo", detailed: "Explique como os conceitos deste conteúdo médico se aplicam à prática clínica, incluindo sinais, sintomas, exames laboratoriais e condutas iniciais. Foque em informações práticas e objetivas, sem se aprofundar em aspectos teóricos irrelevantes." },
  { short: "Gere uma pergunta de revisão sobre este conteúdo", detailed: "Gere uma pergunta de revisão sobre este conteúdo médico, incluindo múltipla escolha ou dissertativa curta, abordando fisiopatologia, diagnóstico, manejo clínico ou condutas urgentes. Foque em pontos práticos aplicáveis na residência médica." },
  { short: "Quais protocolos clínicos se aplicam a este conteúdo?", detailed: "Liste e explique os protocolos clínicos, guidelines ou condutas baseadas em evidência para este conteúdo médico. Enfatize condutas práticas, urgentes ou de rotina, e pontos críticos para tomada de decisão na clínica do paciente." },
  { short: "Quais são as evidências de tratamento mais recentes?", detailed: "Liste e explique as evidências científicas mais recentes relacionadas ao tratamento desta condição. Inclua comparações de condutas terapêuticas, eficácia, riscos, efeitos adversos e recomendações práticas baseadas em guidelines reconhecidas." },
  { short: "Como diagnosticar esta condição com base em evidências?", detailed: "Quais são os principais achados clínicos, laboratoriais e de imagem indicados pelas evidências para o diagnóstico desta condição? Destaque exames de maior sensibilidade e especificidade, critérios diagnósticos aceitos e recomendações práticas." },
  { short: "Explique a fisiopatologia desta condição", detailed: "Explique a fisiopatologia desta condição com base nas evidências disponíveis, incluindo mecanismos moleculares, alterações anatômicas e correlações clínicas relevantes, de forma objetiva e prática para aplicação em estudos clínicos ou residência médica." },
  { short: "Crie um caso clínico educativo baseado em evidências", detailed: "Com base nas evidências do OpenEvidence, crie um caso clínico educativo, incluindo história clínica, exame físico, achados laboratoriais e exames de imagem. Destaque pontos de decisão clínica, diagnóstico diferencial e manejo, visando aprendizado prático para residência médica." }
];

// ============================
// VARIÁVEIS GLOBAIS DO ASSISTENTE IA
// ============================

let selectedText = '';
let currentPlatform = 'chatgpt';

// ============================
// UTILITÁRIOS
// ============================

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function isMobile() {
  return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
}

function addFadeInClass(element) {
  if (element) {
    element.classList.add('fade-in');
  }
}

// ============================
// CARREGAMENTO DINÂMICO DE COMPONENTES
// ============================

async function loadAIAssistant() {
  const container = document.getElementById('ai-assistant-container');
  if (!container) {
    console.error('Contêiner do assistente de IA não encontrado.');
    return false;
  }

  try {
    const response = await fetch('assistant.html');
    if (!response.ok) {
      throw new Error(`Erro ao carregar assistant.html: ${response.statusText}`);
    }
    container.innerHTML = await response.text();
    console.log('Assistente de IA carregado dinamicamente.');
    return true;
  } catch (error) {
    console.error('Falha ao carregar o assistente de IA:', error);
    return false;
  }
}

// ============================
// FUNCIONALIDADES DO ASSISTENTE IA
// ============================

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Texto copiado para a área de transferência');
    return true;
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Erro no fallback de cópia:', fallbackErr);
      document.body.removeChild(textArea);
      return false;
    }
  }
}

function openChatGPT(question) {
  const fullPrompt = selectedText ? `${question}\n\nTexto selecionado:\n${selectedText}` : question;
  copyToClipboard(fullPrompt);
  window.open('https://chat.openai.com/', '_blank' );
  showNotification('Pergunta copiada! Cole no ChatGPT.');
}

function loadOpenEvidence(question) {
  const fullPrompt = selectedText ? `${question}\n\nTexto selecionado:\n${selectedText}` : question;
  copyToClipboard(fullPrompt);
  
  const iframeContainer = document.getElementById('openevidence-iframe-container');
  const iframe = document.getElementById('openevidence-iframe');
  
  if (iframeContainer && iframe) {
    iframeContainer.style.display = 'block';
    iframe.src = 'https://openevidence.com';
    showNotification('Pergunta copiada! Cole no OpenEvidence abaixo.' );
  }
}

function showNotification(message) {
  const existingNotification = document.querySelector('.ai-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'ai-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

function handleTextSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 0) {
    selectedText = text;
    updateSelectedTextDisplay();
  }
}

function updateSelectedTextDisplay() {
  const container = document.getElementById('selected-text-container');
  const textDiv = document.getElementById('selected-text');
  
  if (container && textDiv) {
    if (selectedText) {
      textDiv.textContent = selectedText;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  }
}

function switchPlatform(platform) {
  currentPlatform = platform;
  
  const chatgptBtn = document.getElementById('chatgpt-btn');
  const openevidenceBtn = document.getElementById('openevidence-btn');
  const iframeContainer = document.getElementById('openevidence-iframe-container');
  
  if (chatgptBtn && openevidenceBtn) {
    chatgptBtn.classList.toggle('active', platform === 'chatgpt');
    openevidenceBtn.classList.toggle('active', platform === 'openevidence');
  }
  
  if (iframeContainer) {
    iframeContainer.style.display = platform === 'openevidence' ? 'block' : 'none';
  }
}

function processQuestion(question) {
  if (currentPlatform === 'chatgpt') {
    openChatGPT(question);
  } else {
    loadOpenEvidence(question);
  }
}

function createPredefinedQuestionButtons() {
  const container = document.getElementById('questions-container');
  if (!container) return;

  container.innerHTML = '';

  PREDEFINED_QUESTIONS.forEach((question) => {
    const button = document.createElement('button');
    button.className = 'question-btn';
    button.textContent = question.short;
    button.title = question.detailed;
    
    button.addEventListener('click', () => {
      processQuestion(question.detailed);
    });
    
    container.appendChild(button);
  });
}

function openAIModal() {
  const modal = document.getElementById('ai-modal');
  const overlay = document.getElementById('ai-modal-overlay');
  
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    updateSelectedTextDisplay();
    
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

function closeAIModal() {
  const modal = document.getElementById('ai-modal');
  const overlay = document.getElementById('ai-modal-overlay');
  
  if (modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
    setTimeout(() => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

function setupAIEventListeners() {
  document.getElementById('ai-assistant-btn')?.addEventListener('click', openAIModal);
  document.getElementById('ai-modal-close')?.addEventListener('click', closeAIModal);
  document.getElementById('ai-modal-overlay')?.addEventListener('click', closeAIModal);
  document.getElementById('chatgpt-btn')?.addEventListener('click', () => switchPlatform('chatgpt'));
  document.getElementById('openevidence-btn')?.addEventListener('click', () => switchPlatform('openevidence'));

  document.getElementById('send-custom-btn')?.addEventListener('click', () => {
    const customQuestion = document.getElementById('custom-question');
    if (customQuestion && customQuestion.value.trim()) {
      processQuestion(customQuestion.value.trim());
      customQuestion.value = '';
    }
  });

  document.getElementById('custom-question')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('send-custom-btn')?.click();
    }
  });

  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);
}

function initializeAIAssistant() {
  console.log('Inicializando assistente IA...');
  try {
    createPredefinedQuestionButtons();
    setupAIEventListeners();
    switchPlatform('chatgpt');
    console.log('Assistente IA inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar assistente IA:', error);
  }
}

// ============================
// CACHE BUST DE IMAGENS
// ============================

function applyCacheBust() {
  document.querySelectorAll('img[id]').forEach(img => {
    if (img.src && !img.src.includes('?t=')) {
      const separator = img.src.includes('?') ? '&' : '?';
      img.src = `${img.src}${separator}t=${new Date().getTime()}`;
    }
  });
}

// ============================
// CRIAÇÃO DINÂMICA DE ELEMENTOS DE INTERFACE
// ============================

function createProgressBar() {
  if (document.getElementById('progress-container')) return;
  const progressContainer = document.createElement('div');
  progressContainer.id = 'progress-container';
  progressContainer.innerHTML = `
    <div id="reading-time">Calculando tempo...</div>
    <div id="progress-bar">0%</div>
  `;
  document.body.appendChild(progressContainer);
  addFadeInClass(progressContainer);
}

function createToggleButton() {
  if (document.getElementById('toggle-btn')) return;
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Abrir/Fechar Sumário');
  toggleBtn.title = 'Sumário';
  toggleBtn.innerHTML = `
    <span class="icon">☰</span>
    <span class="label">Sumário</span>
  `;
  document.body.appendChild(toggleBtn);
  addFadeInClass(toggleBtn);
}

function createSidebar() {
  if (document.getElementById('sidebar')) return;
  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  sidebar.setAttribute('aria-label', 'Sumário da página');
  sidebar.innerHTML = '<ul id="lista-sumario"></ul>';
  document.body.appendChild(sidebar);
  createSidebarOverlay();
}

function createSidebarOverlay() {
  if (document.getElementById('sidebar-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);
  overlay.addEventListener('click', closeSidebar);
}

// ============================
// GERAÇÃO AUTOMÁTICA DO SUMÁRIO
// ============================

function generateSummary() {
  const headers = document.querySelectorAll('h0, h1, h2, h3, h4');
  const lista = document.getElementById('lista-sumario');
  if (!lista) return;

  lista.innerHTML = '';
  
  headers.forEach((header, index) => {
    if (header.tagName === 'H0' && index === 0) return;
    if (!header.id) header.id = `titulo-${index}`;
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = `#${header.id}`;
    a.textContent = header.textContent.trim();
    a.title = `Ir para: ${header.textContent.trim()}`;
    
    const level = parseInt(header.tagName.charAt(1));
    if (level >= 1) li.style.marginLeft = `${(level - 1) * 20}px`;
    
    li.className = `summary-level-${level}`;
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToElement(header);
      if (isMobile()) closeSidebar();
    });
    
    li.appendChild(a);
    lista.appendChild(li);
  });
}

function scrollToElement(element) {
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: 'smooth'
    });
  }
}

// ============================
// CONTROLE DA SIDEBAR
// ============================

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.contains('active') ? closeSidebar() : openSidebar();
}

function openSidebar() {
  document.getElementById('sidebar')?.classList.add('active');
  document.getElementById('sidebar')?.setAttribute('aria-hidden', 'false');
  if (isMobile()) {
    document.getElementById('sidebar-overlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  document.getElementById('toggle-btn')?.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('active');
  document.getElementById('sidebar')?.setAttribute('aria-hidden', 'true');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('toggle-btn')?.setAttribute('aria-expanded', 'false');
}

// ============================
// BARRA DE PROGRESSO DE LEITURA
// ============================

function updateProgress() {
  const progressBar = document.getElementById('progress-bar');
  const readingTimeEl = document.getElementById('reading-time');
  if (!progressBar || !readingTimeEl) return;

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  const percent = Math.min(100, Math.round(progress));

  const containerWidth = document.getElementById('progress-container')?.offsetWidth || 0;
  const readingTimeWidth = readingTimeEl.offsetWidth || 0;
  const barWidth = (containerWidth - readingTimeWidth) * (percent / 100);

  progressBar.style.width = `${barWidth}px`;
  progressBar.textContent = `${percent}%`;
  progressBar.classList.toggle('complete', percent === 100);

  updateReadingTime(percent, readingTimeEl);
}

function updateReadingTime(percent, readingTimeEl) {
  const words = (document.body.innerText || '').trim().split(/\s+/).length;
  const totalMinutes = words / CONFIG.WPM;
  const minutesLeft = Math.max(0, Math.ceil(totalMinutes * (1 - percent / 100)));
  const hours = Math.floor(minutesLeft / 60);
  const mins = minutesLeft % 60;

  if (percent === 100) {
    readingTimeEl.textContent = 'Leitura concluída! ✅';
  } else if (hours > 0) {
    readingTimeEl.textContent = `Tempo restante: ⏳ ${hours}h ${mins}m`;
  } else {
    readingTimeEl.textContent = `Tempo restante: ⏳ ${mins}m`;
  }
}

// ============================
// EVENTOS E INICIALIZAÇÃO
// ============================

function setupEventListeners() {
  document.getElementById('toggle-btn')?.addEventListener('click', toggleSidebar);
  
  const throttledUpdateProgress = throttle(updateProgress, CONFIG.SCROLL_THROTTLE);
  window.addEventListener('scroll', throttledUpdateProgress);
  window.addEventListener('resize', updateProgress);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('sidebar')?.classList.contains('active')) closeSidebar();
      if (document.getElementById('ai-modal')?.classList.contains('active')) closeAIModal();
    }
  });
}

async function initializeApp() {
  console.log('Inicializando aplicação...');
  try {
    // 1. Carrega o HTML do assistente de IA primeiro
    const assistantLoaded = await loadAIAssistant();

    // 2. Cria os outros elementos da interface
    applyCacheBust();
    createProgressBar();
    createToggleButton();
    createSidebar();
    
    // 3. Gera o sumário
    generateSummary();
    
    // 4. Configura os event listeners principais
    setupEventListeners();
    
    // 5. Se o assistente foi carregado, inicializa suas funções
    if (assistantLoaded) {
      initializeAIAssistant();
    }
    
    // 6. Atualiza o progresso inicial
    updateProgress();
    
    console.log('Aplicação inicializada com sucesso!');
  } catch (error) {
    console.error('Erro durante a inicialização:', error);
  }
}

// ============================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
