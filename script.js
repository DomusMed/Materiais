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
    
    // 5. Atualiza progresso inicial
    updateProgress();
    
    console.log('Aplicação inicializada com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a inicialização:', error);
  }
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

