/**
 * ============================
 * SCRIPT PRINCIPAL DO MODELO DE RESUMOS MÉDICOS
 * ============================
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
    short: "Crie um caso clínico educativo baseado em evidências",
    detailed: "Com base nas evidências disponíveis, crie um caso clínico educativo, incluindo história clínica, exame físico, achados laboratoriais e exames de imagem. Destaque pontos de decisão clínica, diagnóstico diferencial e manejo, visando aprendizado prático para residência médica."
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
    short: "Crie um flashcard cloze deletion deste conceito",
    detailed: "Com base no texto fornecido, crie um flashcard em formato de frase única afirmativa, no estilo cloze deletion, utilizando a formatação {{c1::termo}}. Oclua apenas o termo chave mais importante do conceito ou definição central do conteúdo, garantindo objetividade e foco prático, adequado para aprendizado médico e revisão rápida."
  }
];

// ============================
// VARIÁVEIS GLOBAIS DO ASSISTENTE IA
// ============================

let selectedText = '';
let currentPlatform = 'chatgpt';

// ============================
// NOVAS VARIÁVEIS GLOBAIS
// ============================

let isFloatingMenuOpen = false;
let currentFontSize = 20;
let isDarkMode = false;

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
// NOVAS FUNCIONALIDADES: MENU FLUTUANTE
// ============================

/**
 * Alterna o menu flutuante principal
 */
function toggleFloatingMenu() {
  const submenu = document.getElementById('floating-submenu');
  const mainBtn = document.getElementById('main-floating-btn');
  
  if (!submenu || !mainBtn) return;
  
  isFloatingMenuOpen = !isFloatingMenuOpen;
  
  if (isFloatingMenuOpen) {
    submenu.classList.add('active');
    mainBtn.style.transform = 'rotate(45deg)';
  } else {
    submenu.classList.remove('active');
    mainBtn.style.transform = 'rotate(0deg)';
  }
}

/**
 * Fecha o menu flutuante
 */
function closeFloatingMenu() {
  const submenu = document.getElementById('floating-submenu');
  const mainBtn = document.getElementById('main-floating-btn');
  
  if (!submenu || !mainBtn) return;
  
  isFloatingMenuOpen = false;
  submenu.classList.remove('active');
  mainBtn.style.transform = 'rotate(0deg)';
}

/**
 * Configura event listeners do menu flutuante
 */
function setupFloatingMenuListeners() {
  // Botão principal do menu flutuante
  const mainBtn = document.getElementById('main-floating-btn');
  if (mainBtn) {
    mainBtn.addEventListener('click', toggleFloatingMenu);
  }

  // Sub-botão do assistente IA
  const aiSubmenuBtn = document.getElementById('ai-submenu-btn');
  if (aiSubmenuBtn) {
    aiSubmenuBtn.addEventListener('click', () => {
      closeFloatingMenu();
      openAIModal();
    });
  }

  // Sub-botão de contato
  const contactBtn = document.getElementById('contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      closeFloatingMenu();
      openContactModal();
    });
  }

  // Sub-botão de sugerir edição
  const suggestEditBtn = document.getElementById('suggest-edit-btn');
  if (suggestEditBtn) {
    suggestEditBtn.addEventListener('click', () => {
      closeFloatingMenu();
      openEditModal();
    });
  }

  // Sub-botão de sugerir via GitHub
  const githubBtn = document.getElementById('github-btn');
  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      closeFloatingMenu();
      openGithubModal();
    });
  }

  // Sub-botão de ferramentas
  const toolsBtn = document.getElementById('tools-btn');
  if (toolsBtn) {
    toolsBtn.addEventListener('click', () => {
      closeFloatingMenu();
      openToolsModal();
    });
  }

  // Sub-botão de quero fazer parte
  const joinTeamBtn = document.getElementById('join-team-btn');
  if (joinTeamBtn) {
    joinTeamBtn.addEventListener('click', () => {
      closeFloatingMenu();
      openJoinTeamModal();
    });
  }
}

// ============================
// NOVAS FUNCIONALIDADES: MODAIS
// ============================

// Funções para abrir e fechar modais (exemplo para Contact Modal)
function openContactModal() {
  const modal = document.getElementById('contact-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  const overlay = document.getElementById('modal-overlay');
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

function setupContactModalListeners() {
  const closeBtn = document.getElementById('contact-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
  const sendBtn = document.getElementById('send-contact-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const message = document.getElementById('contact-message').value;
      if (message) {
        window.location.href = `mailto:seuemail@example.com?subject=Contato DomusMed&body=${encodeURIComponent(message)}`;
        closeContactModal();
      }
    });
  }
}

// Funções para o Modal de Edição
function openEditModal() {
  const modal = document.getElementById('edit-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  const overlay = document.getElementById('modal-overlay');
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

function setupEditModalListeners() {
  const closeBtn = document.getElementById('edit-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
  const sendBtn = document.getElementById('send-edit-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const message = document.getElementById('edit-message').value;
      if (message) {
        window.location.href = `mailto:seuemail@example.com?subject=Sugestão de Edição DomusMed&body=${encodeURIComponent(message)}`;
        closeEditModal();
      }
    });
  }
}

// Funções para o Modal do GitHub
function openGithubModal() {
  const modal = document.getElementById('github-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    updateGithubSelectedTextDisplay();
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

function closeGithubModal() {
  const modal = document.getElementById('github-modal');
  const overlay = document.getElementById('modal-overlay');
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

function updateGithubSelectedTextDisplay() {
  const container = document.getElementById('github-selected-text-container');
  const textDiv = document.getElementById('github-selected-text');
  if (container && textDiv) {
    if (selectedText) {
      textDiv.textContent = selectedText;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  }
}

function setupGithubModalListeners() {
  const closeBtn = document.getElementById('github-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeGithubModal);
  const sendBtn = document.getElementById('send-github-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const suggestion = document.getElementById('github-suggestion').value;
      const fullSuggestion = selectedText ? `Texto selecionado: ${selectedText}\n\nSugestão: ${suggestion}` : suggestion;
      if (fullSuggestion) {
        // Aqui você integraria com a API do GitHub ou abriria um link para criar uma discussão
        // Por simplicidade, vamos apenas logar e fechar o modal
        console.log('Sugestão para GitHub:', fullSuggestion);
        alert('Funcionalidade de envio para GitHub não implementada. Sugestão logada no console.');
        closeGithubModal();
      }
    });
  }
}

// Funções para o Modal de Ferramentas
function openToolsModal() {
  const modal = document.getElementById('tools-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

function closeToolsModal() {
  const modal = document.getElementById('tools-modal');
  const overlay = document.getElementById('modal-overlay');
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

function setupToolsModalListeners() {
  const closeBtn = document.getElementById('tools-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeToolsModal);

  // Modo Claro/Escuro
  const lightModeBtn = document.getElementById('light-mode-btn');
  const darkModeBtn = document.getElementById('dark-mode-btn');

  if (lightModeBtn) {
    lightModeBtn.addEventListener('click', () => setDarkMode(false));
  }
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => setDarkMode(true));
  }

  // Ajuste de Fonte
  const fontSizeSlider = document.getElementById('font-size-slider');
  const fontSizeValue = document.getElementById('font-size-value');
  const fontPresetButtons = document.querySelectorAll('.font-preset-btn');

  if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      setFontSize(size);
    });
  }

  fontPresetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = parseInt(btn.dataset.size);
      setFontSize(size);
    });
  });
}

function setDarkMode(enable) {
  isDarkMode = enable;
  document.body.classList.toggle('dark-mode', enable);
  localStorage.setItem('darkMode', enable);
  updateThemeButtons();
}

function initializeTheme() {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
}

function updateThemeButtons() {
  const lightModeBtn = document.getElementById('light-mode-btn');
  const darkModeBtn = document.getElementById('dark-mode-btn');
  if (lightModeBtn && darkModeBtn) {
    lightModeBtn.classList.toggle('active', !isDarkMode);
    darkModeBtn.classList.toggle('active', isDarkMode);
  }
}

function setFontSize(size) {
  currentFontSize = size;
  document.body.style.fontSize = `${size}px`;
  const fontSizeValue = document.getElementById('font-size-value');
  if (fontSizeValue) fontSizeValue.textContent = size;
  localStorage.setItem('fontSize', size);
  updateFontSizeButtons();
}

function initializeFontSize() {
  const savedSize = localStorage.getItem('fontSize');
  if (savedSize) {
    setFontSize(parseInt(savedSize));
    const fontSizeSlider = document.getElementById('font-size-slider');
    if (fontSizeSlider) fontSizeSlider.value = savedSize;
  } else {
    setFontSize(currentFontSize); // Define o tamanho padrão se não houver um salvo
  }
}

function updateFontSizeButtons() {
  const fontPresetButtons = document.querySelectorAll('.font-preset-btn');
  fontPresetButtons.forEach(btn => {
    const size = parseInt(btn.dataset.size);
    btn.classList.toggle('active', size === currentFontSize);
  });
}

// Funções para o Modal "Quero fazer parte"
function openJoinTeamModal() {
  const modal = document.getElementById('join-team-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
}

function closeJoinTeamModal() {
  const modal = document.getElementById('join-team-modal');
  const overlay = document.getElementById('modal-overlay');
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

function setupJoinTeamModalListeners() {
  const closeBtn = document.getElementById('join-team-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeJoinTeamModal);

  const sendBtn = document.getElementById('send-join-team-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name = document.getElementById('join-name').value;
      const email = document.getElementById('join-email').value;
      const phone = document.getElementById('join-phone').value;
      const status = document.getElementById('join-status').value;
      const semester = document.getElementById('join-semester').value;
      const motivation = document.getElementById('join-motivation').value;

      if (name && email && status && motivation) {
        let body = `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nStatus Acadêmico: ${status}`;
        if (status === 'estudante' && semester) {
          body += `\nSemestre: ${semester}`;
        }
        body += `\nMotivação: ${motivation}`;

        window.location.href = `mailto:seuemail@example.com?subject=Quero fazer parte da DomusMed&body=${encodeURIComponent(body)}`;
        closeJoinTeamModal();
      } else {
        alert('Por favor, preencha todos os campos obrigatórios (Nome, E-mail, Status e Motivação).');
      }
    });
  }

  const joinStatus = document.getElementById('join-status');
  const semesterGroup = document.getElementById('semester-group');
  if (joinStatus && semesterGroup) {
    joinStatus.addEventListener('change', (e) => {
      if (e.target.value === 'estudante') {
        semesterGroup.style.display = 'block';
      } else {
        semesterGroup.style.display = 'none';
      }
    });
  }
}

// ============================
// CARREGAMENTO DE PARCIAIS (MODALS)
// ============================

/**
 * Carrega o conteúdo de modals.html para o #partials-container
 */
async function loadPartials() {
  try {
    const response = await fetch('modals.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    const partialsContainer = document.getElementById('partials-container');
    if (partialsContainer) {
      partialsContainer.innerHTML = data;
      // Após carregar os parciais, inicializa os listeners do menu flutuante e modais
      setupFloatingMenuListeners();
      setupAIEventListeners();
      createPlatformButtons();
      createPredefinedQuestionButtons();
      setupContactModalListeners();
      setupEditModalListeners();
      setupGithubModalListeners();
      setupToolsModalListeners();
      setupJoinTeamModalListeners();
      initializeTheme();
      initializeFontSize();
    }
  } catch (error) {
    console.error('Erro ao carregar os parciais:', error);
  }
}

// Chama a função para carregar os parciais quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', loadPartials);
