/**
 * ============================
 * SCRIPT PRINCIPAL DO MODELO DE RESUMOS MÉDICOS
 * ============================
 * 
 * Este script contém toda a lógica necessária para:
 * - Criação dinâmica de elementos de interface
 * - Geração automática do sumário
 * - Controle da sidebar retrátil
 * - Barra de progresso de leitura
 * - Cache bust de imagens
 * - Responsividade e acessibilidade
 * - Assistente IA com seleção de texto e integração ChatGPT/OpenEvidence/Consensus/Perplexity
 */

// ============================
// CONFIGURAÇÕES GLOBAIS
// ============================

const CONFIG = {
  WPM: 150, // Palavras por minuto para cálculo de tempo de leitura
  MOBILE_BREAKPOINT: 768, // Breakpoint para dispositivos móveis
  SCROLL_THROTTLE: 16, // Throttle para eventos de scroll (60fps)
  SIDEBAR_ANIMATION_DURATION: 300 // Duração da animação da sidebar em ms
};

// ============================
// URLS DAS PLATAFORMAS DE IA
// ============================

const AI_PLATFORMS = {
  chatgpt: 'https://chat.openai.com/',
  openevidence: 'https://openevidence.com',
  consensus: 'https://consensus.app',
  perplexity: 'https://www.perplexity.ai'
};

// ============================
// PERGUNTAS PRÉ-FORMULADAS
// ============================

const PREDEFINED_QUESTIONS = [
  {
    short: "Explique este conteúdo de forma simples para uma criança de 10 anos",
    detailed: "Explique este conteúdo médico como se estivesse ensinando a uma criança de 10 anos, usando analogias simples, mantendo os conceitos corretos, de forma extremamente clara e didática. Foque na compreensão básica sem jargão técnico."
  },
  {
    short: "Resuma o conteúdo em um parágrafo para revisão rápida (nível doutorado)",
    detailed: "Explique este conteúdo médico em um único parágrafo como resumo de aula de doutorado. Inclua pontos essenciais de fisiopatologia, epidemiologia, manifestações clínicas, diagnóstico diferencial, exames relevantes, tratamento ou prognóstico. Ressalte aspectos práticos e correlações anatômicas ou clínicas importantes."
  },
  {
    short: "Explique o conteúdo completo detalhado (nível doutorado)",
    detailed: "Explique este conteúdo médico detalhadamente, como em uma aula de doutorado. Inclua fisiopatologia, epidemiologia, manifestações clínicas, diagnóstico diferencial, exames laboratoriais e de imagem, tratamento, prognóstico e condutas práticas. Faça correlações anatômicas, fisiológicas ou clínicas quando relevante, priorizando informações práticas e objetivas."
  },
  {
    short: "Crie um caso clínico real baseado neste conteúdo",
    detailed: "Com base neste conteúdo médico, crie um caso clínico realista, incluindo história clínica, exame físico e resultados laboratoriais/exames de imagem relevantes. Destaque pontos importantes para tomada de decisão, diagnóstico e manejo, de forma educativa, sem fornecer respostas prontas."
  },
  {
    short: "Faça um resumo objetivo do conteúdo para estudo prático",
    detailed: "Faça um resumo conciso do conteúdo médico, destacando sinais e sintomas chave, condutas iniciais, exames relevantes ou conceitos importantes para tomada de decisão clínica rápida, conforme o contexto apresentado."
  },
  {
    short: "Mostre a aplicação prática clínica do conteúdo",
    detailed: "Explique como os conceitos deste conteúdo médico se aplicam à prática clínica, incluindo sinais, sintomas, exames laboratoriais e condutas iniciais. Foque em informações práticas e objetivas, sem se aprofundar em aspectos teóricos irrelevantes."
  },
  {
    short: "Gere uma pergunta de revisão sobre este conteúdo",
    detailed: "Gere uma pergunta de revisão sobre este conteúdo médico, incluindo múltipla escolha ou dissertativa curta, abordando fisiopatologia, diagnóstico, manejo clínico ou condutas urgentes. Foque em pontos práticos aplicáveis na residência médica."
  },
  {
    short: "Quais protocolos clínicos se aplicam a este conteúdo?",
    detailed: "Liste e explique os protocolos clínicos, guidelines ou condutas baseadas em evidência para este conteúdo médico. Enfatize condutas práticas, urgentes ou de rotina, e pontos críticos para tomada de decisão na clínica do paciente."
  },
  {
    short: "Quais são as evidências de tratamento mais recentes?",
    detailed: "Liste e explique as evidências científicas mais recentes relacionadas ao tratamento desta condição. Inclua comparações de condutas terapêuticas, eficácia, riscos, efeitos adversos e recomendações práticas baseadas em guidelines reconhecidas."
  },
  {
    short: "Como diagnosticar esta condição com base em evidências?",
    detailed: "Quais são os principais achados clínicos, laboratoriais e de imagem indicados pelas evidências para o diagnóstico desta condição? Destaque exames de maior sensibilidade e especificidade, critérios diagnósticos aceitos e recomendações práticas."
  },
  {
    short: "Explique a fisiopatologia desta condição",
    detailed: "Explique a fisiopatologia desta condição com base nas evidências disponíveis, incluindo mecanismos moleculares, alterações anatômicas e correlações clínicas relevantes, de forma objetiva e prática para aplicação em estudos clínicos ou residência médica."
  },
  {
    short: "Crie um caso clínico educativo baseado em evidências",
    detailed: "Com base nas evidências disponíveis, crie um caso clínico educativo, incluindo história clínica, exame físico, achados laboratoriais e exames de imagem. Destaque pontos de decisão clínica, diagnóstico diferencial e manejo, visando aprendizado prático para residência médica."
  }
];

// ============================
// VARIÁVEIS GLOBAIS DO ASSISTENTE IA
// ============================

let selectedText = '';
let currentPlatform = 'chatgpt';

// ============================
// UTILITÁRIOS
// ============================

/**
 * Função para throttle de eventos
 */
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

/**
 * Verifica se é dispositivo móvel
 */
function isMobile() {
  return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
}

/**
 * Adiciona classe com animação fade-in
 */
function addFadeInClass(element) {
  if (element) {
    element.classList.add('fade-in');
  }
}

// ============================
// FUNCIONALIDADES DO ASSISTENTE IA
// ============================

/**
 * Copia texto para a área de transferência
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Texto copiado para a área de transferência');
    return true;
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
    // Fallback para navegadores mais antigos
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

/**
 * Abre uma plataforma de IA em nova aba com a pergunta e texto selecionado
 */
function openAIPlatform(platform, question) {
  const fullPrompt = selectedText ? `${question}\n\nTexto selecionado:\n${selectedText}` : question;
  copyToClipboard(fullPrompt);
  
  const url = AI_PLATFORMS[platform];
  if (url) {
    window.open(url, '_blank');
    showNotification(`Pergunta copiada! Cole no ${getPlatformDisplayName(platform)}.`);
  } else {
    console.error('Plataforma não encontrada:', platform);
  }
}

/**
 * Retorna o nome de exibição da plataforma
 */
function getPlatformDisplayName(platform) {
  const names = {
    chatgpt: 'ChatGPT',
    openevidence: 'OpenEvidence',
    consensus: 'Consensus',
    perplexity: 'Perplexity'
  };
  return names[platform] || platform;
}

/**
 * Mostra notificação temporária
 */
function showNotification(message) {
  // Remove notificação existente
  const existingNotification = document.querySelector('.ai-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'ai-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove após 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

/**
 * Lida com seleção de texto na página
 */
function handleTextSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 0) {
    selectedText = text;
    updateSelectedTextDisplay();
  }
}

/**
 * Atualiza a exibição do texto selecionado no modal
 */
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

/**
 * Alterna entre plataformas
 */
function switchPlatform(platform) {
  currentPlatform = platform;
  
  // Atualiza botões de plataforma
  const platformButtons = document.querySelectorAll('.platform-btn');
  platformButtons.forEach(btn => {
    const btnPlatform = btn.getAttribute('data-platform');
    btn.classList.toggle('active', btnPlatform === platform);
  });
}

/**
 * Processa pergunta (pré-formulada ou personalizada)
 */
function processQuestion(question) {
  openAIPlatform(currentPlatform, question);
}

/**
 * Cria botões de plataformas de IA
 */
function createPlatformButtons() {
  const container = document.querySelector('.platform-buttons');
  if (!container) return;

  container.innerHTML = '';

  const platforms = [
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'openevidence', name: 'OpenEvidence' },
    { id: 'consensus', name: 'Consensus' },
    { id: 'perplexity', name: 'Perplexity' }
  ];

  platforms.forEach(platform => {
    const button = document.createElement('button');
    button.className = 'platform-btn';
    button.setAttribute('data-platform', platform.id);
    button.textContent = platform.name;
    
    button.addEventListener('click', () => switchPlatform(platform.id));
    
    container.appendChild(button);
  });
}

/**
 * Cria botões de perguntas pré-formuladas
 */
function createPredefinedQuestionButtons() {
  const container = document.getElementById('questions-container');
  if (!container) return;

  container.innerHTML = '';

  PREDEFINED_QUESTIONS.forEach((question, index) => {
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

/**
 * Abre o modal do assistente IA
 */
function openAIModal() {
  const modal = document.getElementById('ai-modal');
  const overlay = document.getElementById('ai-modal-overlay');
  
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Atualiza texto selecionado
    updateSelectedTextDisplay();
    
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

/**
 * Fecha o modal do assistente IA
 */
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

/**
 * Configura event listeners do assistente IA
 */
function setupAIEventListeners() {
  // Botão para abrir modal
  const aiBtn = document.getElementById('ai-assistant-btn');
  if (aiBtn) {
    aiBtn.addEventListener('click', openAIModal);
  }

  // Botão para fechar modal
  const closeBtn = document.getElementById('ai-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAIModal);
  }

  // Overlay para fechar modal
  const overlay = document.getElementById('ai-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeAIModal);
  }

  // Botão de enviar pergunta personalizada
  const sendCustomBtn = document.getElementById('send-custom-btn');
  if (sendCustomBtn) {
    sendCustomBtn.addEventListener('click', () => {
      const customQuestion = document.getElementById('custom-question');
      if (customQuestion && customQuestion.value.trim()) {
        processQuestion(customQuestion.value.trim());
        customQuestion.value = '';
      }
    });
  }

  // Enter no textarea para enviar
  const customQuestion = document.getElementById('custom-question');
  if (customQuestion) {
    customQuestion.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const sendBtn = document.getElementById('send-custom-btn');
        if (sendBtn) sendBtn.click();
      }
    });
  }

  // Seleção de texto na página
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);

  // ESC para fechar modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('ai-modal');
      if (modal && modal.classList.contains('active')) {
        closeAIModal();
      }
    }
  });
}

// ============================
// CACHE BUST DE IMAGENS
// ============================

/**
 * Aplica cache bust em todas as imagens com ID
 * Previne problemas de cache em imagens externas
 */
function applyCacheBust() {
  const images = document.querySelectorAll('img[id]');
  
  images.forEach(img => {
    if (img.src && !img.src.includes('?t=')) {
      const separator = img.src.includes('?') ? '&' : '?';
      img.src = img.src + separator + 't=' + new Date().getTime();
      console.log('Cache bust aplicado à imagem:', img.id);
    }
  });
}

// Executa após carregar a página
window.addEventListener('load', applyCacheBust);

// ============================
// CRIAÇÃO DINÂMICA DE ELEMENTOS DE INTERFACE
// ============================

/**
 * Cria a barra de progresso de leitura
 */
function createProgressBar() {
  // Verifica se já existe
  if (document.getElementById('progress-container')) {
    return;
  }

  const progressContainer = document.createElement('div');
  progressContainer.id = 'progress-container';
  
  const readingTime = document.createElement('div');
  readingTime.id = 'reading-time';
  readingTime.textContent = 'Calculando tempo...';
  
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  progressBar.textContent = '0%';
  
  progressContainer.appendChild(readingTime);
  progressContainer.appendChild(progressBar);
  
  document.body.appendChild(progressContainer);
  addFadeInClass(progressContainer);
  
  console.log('Barra de progresso criada dinamicamente');
}

/**
 * Cria o botão flutuante do sumário
 */
function createToggleButton() {
  // Verifica se já existe
  if (document.getElementById('toggle-btn')) {
    return;
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Abrir/Fechar Sumário');
  toggleBtn.setAttribute('title', 'Sumário');
  
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = '☰';
  
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = 'Sumário';
  
  toggleBtn.appendChild(icon);
  toggleBtn.appendChild(label);
  
  document.body.appendChild(toggleBtn);
  addFadeInClass(toggleBtn);
  
  console.log('Botão de sumário criado dinamicamente');
  return toggleBtn;
}

/**
 * Cria a sidebar do sumário
 */
function createSidebar() {
  // Verifica se já existe
  if (document.getElementById('sidebar')) {
    return;
  }

  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  sidebar.setAttribute('aria-label', 'Sumário da página');
  
  const ul = document.createElement('ul');
  ul.id = 'lista-sumario';
  
  sidebar.appendChild(ul);
  document.body.appendChild(sidebar);
  
  // Cria overlay para mobile
  createSidebarOverlay();
  
  console.log('Sidebar criada dinamicamente');
  return sidebar;
}

/**
 * Cria overlay para sidebar em dispositivos móveis
 */
function createSidebarOverlay() {
  // Verifica se já existe
  if (document.getElementById('sidebar-overlay')) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  
  document.body.appendChild(overlay);
  
  // Adiciona evento para fechar sidebar ao clicar no overlay
  overlay.addEventListener('click', closeSidebar);
  
  console.log('Overlay da sidebar criado');
  return overlay;
}

// ============================
// GERAÇÃO AUTOMÁTICA DO SUMÁRIO
// ============================

/**
 * Gera o sumário automaticamente baseado nos cabeçalhos da página
 */
function generateSummary() {
  const headers = document.querySelectorAll('h0, h1, h2, h3, h4');
  const lista = document.getElementById('lista-sumario');
  
  if (!lista) {
    console.warn('Lista do sumário não encontrada');
    return;
  }

  // Limpa lista existente
  lista.innerHTML = '';
  
  let summaryCount = 0;
  
  headers.forEach((header, index) => {
    // Pula h0 se for o título principal
    if (header.tagName === 'H0' && index === 0) {
      return;
    }
    
    // Cria ID único se não existir
    if (!header.id) {
      header.id = `titulo-${index}`;
    }
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = `#${header.id}`;
    a.textContent = header.textContent.trim();
    a.setAttribute('title', `Ir para: ${header.textContent.trim()}`);
    
    // Aplica indentação baseada no nível do cabeçalho
    const level = parseInt(header.tagName.charAt(1));
    if (level >= 1) {
      li.style.marginLeft = `${(level - 1) * 20}px`;
    }
    
    // Adiciona classe para estilização específica
    li.className = `summary-level-${level}`;
    
    // Evento de clique para scroll suave
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToElement(header);
      
      // Fecha sidebar em mobile após clique
      if (isMobile()) {
        closeSidebar();
      }
    });
    
    li.appendChild(a);
    lista.appendChild(li);
    summaryCount++;
  });
  
  console.log(`Sumário gerado com ${summaryCount} itens`);
}

/**
 * Scroll suave para elemento
 */
function scrollToElement(element) {
  if (element) {
    const offsetTop = element.offsetTop - 80; // Offset para não ficar colado no topo
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// ============================
// CONTROLE DA SIDEBAR
// ============================

/**
 * Alterna visibilidade da sidebar
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (!sidebar) return;
  
  const isActive = sidebar.classList.contains('active');
  
  if (isActive) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

/**
 * Abre a sidebar
 */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtn = document.getElementById('toggle-btn');
  
  if (sidebar) {
    sidebar.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
  }
  
  if (overlay && isMobile()) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  }
  
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
  
  // Previne scroll do body em mobile
  if (isMobile()) {
    document.body.style.overflow = 'hidden';
  }
  
  console.log('Sidebar aberta');
}

/**
 * Fecha a sidebar
 */
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtn = document.getElementById('toggle-btn');
  
  if (sidebar) {
    sidebar.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
  }
  
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
  
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  
  // Restaura scroll do body
  document.body.style.overflow = '';
  
  console.log('Sidebar fechada');
}

// ============================
// BARRA DE PROGRESSO DE LEITURA
// ============================

/**
 * Calcula e atualiza a barra de progresso de leitura
 */
function updateProgress() {
  const progressBar = document.getElementById('progress-bar');
  const readingTimeEl = document.getElementById('reading-time');
  
  if (!progressBar || !readingTimeEl) return;
  
  // Calcula progresso do scroll
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  const percent = Math.min(100, Math.round(progress));
  
  // Atualiza largura da barra
  const containerWidth = document.getElementById('progress-container')?.offsetWidth || 0;
  const readingTimeWidth = readingTimeEl.offsetWidth || 0;
  const barWidth = (containerWidth - readingTimeWidth) * (percent / 100);
  
  progressBar.style.width = `${barWidth}px`;
  progressBar.textContent = `${percent}%`;
  
  // Muda cor quando completo
  if (percent === 100) {
    progressBar.classList.add('complete');
  } else {
    progressBar.classList.remove('complete');
  }
  
  // Calcula tempo restante
  updateReadingTime(percent, readingTimeEl);
}

/**
 * Calcula e atualiza o tempo estimado de leitura
 */
function updateReadingTime(percent, readingTimeEl) {
  // Conta palavras do conteúdo principal
  const bodyText = document.body.innerText || document.body.textContent || '';
  const words = bodyText.trim().split(/\s+/).length;
  const totalMinutes = words / CONFIG.WPM;
  
  const minutesLeft = Math.max(0, Math.ceil(totalMinutes * (1 - percent / 100)));
  const hours = Math.floor(minutesLeft / 60);
  const mins = minutesLeft % 60;
  
  let timeText = 'Tempo restante estimado: ⏳ ';
  
  if (percent === 100) {
    timeText = 'Leitura concluída! ✅';
  } else if (hours > 0) {
    timeText += `${hours}h ${mins}m`;
  } else {
    timeText += `${mins}m`;
  }
  
  readingTimeEl.textContent = timeText;
}

// ============================
// EVENTOS E INICIALIZAÇÃO
// ============================

/**
 * Configura todos os event listeners
 */
function setupEventListeners() {
  // Botão de toggle da sidebar
  const toggleBtn = document.getElementById('toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
    
    // Suporte a teclado
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSidebar();
      }
    });
  }
  
  // Eventos de scroll com throttle
  const throttledUpdateProgress = throttle(updateProgress, CONFIG.SCROLL_THROTTLE);
  window.addEventListener('scroll', throttledUpdateProgress);
  
  // Eventos de redimensionamento
  window.addEventListener('resize', () => {
    updateProgress();
    
    // Fecha sidebar em desktop se estiver aberta
    if (!isMobile()) {
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay && overlay.classList.contains('active')) {
        closeSidebar();
      }
    }
  });
  
  // Tecla ESC para fechar sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    }
  });
  
  console.log('Event listeners configurados');
}

/**
 * Inicialização principal do script
 */
function initializeApp() {
  console.log('Inicializando aplicação...');
  
  try {
    // 1. Aplica cache bust nas imagens
    applyCacheBust();
    
    // 2. Cria elementos de interface dinamicamente
    createProgressBar();
    createToggleButton();
    createSidebar();
    
    // 3. Gera sumário automaticamente
    generateSummary();
    
    // 4. Configura event listeners
    setupEventListeners();
    
    // 5. Inicializa assistente IA
    initializeAIAssistant();
    
    // 6. Atualiza progresso inicial
    updateProgress();
    
    console.log('Aplicação inicializada com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a inicialização:', error);
  }
}

/**
 * Inicializa o assistente IA
 */
function initializeAIAssistant() {
  console.log('Inicializando assistente IA...');
  
  try {
    // Cria botões de plataformas
    createPlatformButtons();
    
    // Cria botões de perguntas pré-formuladas
    createPredefinedQuestionButtons();
    
    // Configura event listeners do assistente IA
    setupAIEventListeners();
    
    // Define plataforma inicial
    switchPlatform('chatgpt');
    
    console.log('Assistente IA inicializado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao inicializar assistente IA:', error);
  }
}

// ============================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM já está pronto
  initializeApp();
}

/**
 * Função de reinicialização para novos conteúdos
 * Útil quando o conteúdo da página é alterado dinamicamente
 */
function reinitialize() {
  console.log('Reinicializando aplicação...');
  
  // Regenera sumário
  generateSummary();
  
  // Atualiza progresso
  updateProgress();
  
  console.log('Aplicação reinicializada');
}

// Expõe funções globais para uso externo se necessário
window.MedicalResumeApp = {
  reinitialize,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  updateProgress,
  generateSummary
};

console.log('Script do modelo de resumos médicos carregado');

