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
 * - Login GitHub OAuth via Supabase
 * - Sistema de anotações
 * - Checklist de estudos
 * - Exportação PDF
 * - Modo claro/escuro
 * - Ajuste de fonte
 */

// ============================
// CONFIGURAÇÕES GLOBAIS
// ============================

const CONFIG = {
  WPM: 150, // Palavras por minuto para cálculo de tempo de leitura
  MOBILE_BREAKPOINT: 768, // Breakpoint para dispositivos móveis
  SCROLL_THROTTLE: 16, // Throttle para eventos de scroll (60fps)
  SIDEBAR_ANIMATION_DURATION: 300, // Duração da animação da sidebar em ms
  
  // Configurações do Supabase - SUBSTITUA PELAS SUAS CHAVES
  SUPABASE_URL: 'http://0.0.0.0:8000/auth/v1/callback', // Exemplo: 'https://xyzcompany.supabase.co'
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3aXJ3dWx6bm12d3phbGpwbmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDAyNTMsImV4cCI6MjA3MzExNjI1M30.GSTjSVlUChh-E0mKVnd4gosXTusAXo-F0mOcLXgoDJw', // Chave pública do Supabase
  
  // URLs para contato e sugestões
  CONTACT_EMAIL: 'contato@domusmed.site',
  GITHUB_DISCUSSION_URL: 'https://github.com/domusmed/resumos/discussions/new?category=suggestions'
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
// VARIÁVEIS GLOBAIS
// ============================

let selectedText = '';
let currentPlatform = 'chatgpt';
let supabaseClient = null;
let currentUser = null;
let currentNotes = [];
let checklistItems = [];
let currentFontSize = 20;
let isDarkTheme = false;

// ============================
// INICIALIZAÇÃO DO SUPABASE
// ============================

/**
 * Inicializa o cliente Supabase
 * IMPORTANTE: Substitua as configurações em CONFIG pelas suas chaves reais
 */
function initializeSupabase() {
  try {
    // Verifica se as chaves foram configuradas
    if (CONFIG.SUPABASE_URL === 'http://0.0.0.0:8000/auth/v1/callback' || CONFIG.SUPABASE_ANON_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3aXJ3dWx6bm12d3phbGpwbmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDAyNTMsImV4cCI6MjA3MzExNjI1M30.GSTjSVlUChh-E0mKVnd4gosXTusAXo-F0mOcLXgoDJw') {
      console.warn('⚠️ Configurações do Supabase não foram definidas. Funcionalidades de login e sincronização estarão desabilitadas.');
      console.warn('📖 Consulte o arquivo Guia_Supabase.md para instruções de configuração.');
      return false;
    }

    // Inicializa o cliente Supabase
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    
    // Verifica se há usuário logado
    checkAuthState();
    
    // Escuta mudanças no estado de autenticação
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        currentUser = session.user;
        updateLoginUI();
        loadUserPreferences();
        loadUserNotes();
        loadUserChecklist();
        showNotification('Login realizado com sucesso!');
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateLoginUI();
        clearUserData();
        showNotification('Logout realizado com sucesso!');
      }
    });
    
    console.log('✅ Supabase inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
    return false;
  }
}

/**
 * Verifica o estado atual de autenticação
 */
async function checkAuthState() {
  if (!supabaseClient) return;
  
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      currentUser = session.user;
      updateLoginUI();
      loadUserPreferences();
      loadUserNotes();
      loadUserChecklist();
    }
  } catch (error) {
    console.error('Erro ao verificar estado de autenticação:', error);
  }
}

// ============================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================

/**
 * Realiza login com GitHub OAuth
 */
async function loginWithGitHub() {
  if (!supabaseClient) {
    showNotification('Supabase não configurado. Consulte a documentação.');
    return;
  }
  
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('Erro no login:', error);
      showNotification('Erro ao fazer login. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    showNotification('Erro ao fazer login. Tente novamente.');
  }
}

/**
 * Realiza logout
 */
async function logout() {
  if (!supabaseClient) return;
  
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Erro no logout:', error);
      showNotification('Erro ao fazer logout. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro no logout:', error);
    showNotification('Erro ao fazer logout. Tente novamente.');
  }
}

/**
 * Atualiza a interface de login
 */
function updateLoginUI() {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  
  if (currentUser) {
    // Usuário logado
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    
    if (userAvatar && currentUser.user_metadata?.avatar_url) {
      userAvatar.src = currentUser.user_metadata.avatar_url;
    }
    
    if (userName) {
      userName.textContent = currentUser.user_metadata?.full_name || 
                           currentUser.user_metadata?.user_name || 
                           currentUser.email?.split('@')[0] || 
                           'Usuário';
    }
  } else {
    // Usuário não logado
    loginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
  }
}

/**
 * Limpa dados do usuário ao fazer logout
 */
function clearUserData() {
  currentNotes = [];
  checklistItems = [];
  updateNotesUI();
  updateChecklistUI();
}

// ============================
// SISTEMA DE ANOTAÇÕES
// ============================

/**
 * Carrega anotações do usuário do Supabase
 */
async function loadUserNotes() {
  if (!supabaseClient || !currentUser) return;
  
  try {
    const summaryId = getSummaryId();
    const { data, error } = await supabaseClient
      .from('notes')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('summary_id', summaryId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar anotações:', error);
      return;
    }
    
    currentNotes = data || [];
    updateNotesUI();
    console.log(`Carregadas ${currentNotes.length} anotações`);
  } catch (error) {
    console.error('Erro ao carregar anotações:', error);
  }
}

/**
 * Salva uma nova anotação no Supabase
 */
async function saveNote(text, selectedText = '') {
  if (!supabaseClient || !currentUser) {
    showNotification('Faça login para salvar anotações');
    return false;
  }
  
  try {
    const summaryId = getSummaryId();
    const { data, error } = await supabaseClient
      .from('notes')
      .insert([
        {
          user_id: currentUser.id,
          summary_id: summaryId,
          text_selected: selectedText,
          note: text,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Erro ao salvar anotação:', error);
      showNotification('Erro ao salvar anotação');
      return false;
    }
    
    // Adiciona à lista local
    currentNotes.unshift(data[0]);
    updateNotesUI();
    showNotification('Anotação salva com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao salvar anotação:', error);
    showNotification('Erro ao salvar anotação');
    return false;
  }
}

/**
 * Atualiza uma anotação existente
 */
async function updateNote(noteId, newText) {
  if (!supabaseClient || !currentUser) return false;
  
  try {
    const { error } = await supabaseClient
      .from('notes')
      .update({ note: newText })
      .eq('id', noteId)
      .eq('user_id', currentUser.id);
    
    if (error) {
      console.error('Erro ao atualizar anotação:', error);
      showNotification('Erro ao atualizar anotação');
      return false;
    }
    
    // Atualiza na lista local
    const noteIndex = currentNotes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
      currentNotes[noteIndex].note = newText;
      updateNotesUI();
    }
    
    showNotification('Anotação atualizada!');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar anotação:', error);
    showNotification('Erro ao atualizar anotação');
    return false;
  }
}

/**
 * Exclui uma anotação
 */
async function deleteNote(noteId) {
  if (!supabaseClient || !currentUser) return false;
  
  if (!confirm('Tem certeza que deseja excluir esta anotação?')) {
    return false;
  }
  
  try {
    const { error } = await supabaseClient
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', currentUser.id);
    
    if (error) {
      console.error('Erro ao excluir anotação:', error);
      showNotification('Erro ao excluir anotação');
      return false;
    }
    
    // Remove da lista local
    currentNotes = currentNotes.filter(note => note.id !== noteId);
    updateNotesUI();
    showNotification('Anotação excluída!');
    return true;
  } catch (error) {
    console.error('Erro ao excluir anotação:', error);
    showNotification('Erro ao excluir anotação');
    return false;
  }
}

/**
 * Atualiza a interface das anotações
 */
function updateNotesUI() {
  const notesList = document.getElementById('notes-list');
  if (!notesList) return;
  
  notesList.innerHTML = '';
  
  if (currentNotes.length === 0) {
    notesList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhuma anotação encontrada</p>';
    return;
  }
  
  currentNotes.forEach(note => {
    const noteElement = createNoteElement(note);
    notesList.appendChild(noteElement);
  });
}

/**
 * Cria elemento HTML para uma anotação
 */
function createNoteElement(note) {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'note-item';
  noteDiv.setAttribute('data-note-id', note.id);
  
  const noteText = document.createElement('div');
  noteText.className = 'note-text';
  noteText.textContent = note.note;
  
  const noteMeta = document.createElement('div');
  noteMeta.className = 'note-meta';
  
  const noteDate = document.createElement('span');
  noteDate.textContent = new Date(note.created_at).toLocaleDateString('pt-BR');
  
  const noteActions = document.createElement('div');
  noteActions.className = 'note-actions';
  
  const editBtn = document.createElement('button');
  editBtn.className = 'note-edit-btn';
  editBtn.textContent = '✏️';
  editBtn.title = 'Editar anotação';
  editBtn.onclick = () => editNote(note.id, note.note);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'note-delete-btn';
  deleteBtn.textContent = '🗑️';
  deleteBtn.title = 'Excluir anotação';
  deleteBtn.onclick = () => deleteNote(note.id);
  
  noteActions.appendChild(editBtn);
  noteActions.appendChild(deleteBtn);
  
  noteMeta.appendChild(noteDate);
  noteMeta.appendChild(noteActions);
  
  noteDiv.appendChild(noteText);
  noteDiv.appendChild(noteMeta);
  
  return noteDiv;
}

/**
 * Edita uma anotação
 */
function editNote(noteId, currentText) {
  const newText = prompt('Editar anotação:', currentText);
  if (newText && newText.trim() !== currentText) {
    updateNote(noteId, newText.trim());
  }
}

/**
 * Adiciona uma nova anotação
 */
function addNewNote() {
  const noteText = prompt('Digite sua anotação:');
  if (noteText && noteText.trim()) {
    saveNote(noteText.trim(), selectedText);
  }
}

/**
 * Filtra anotações por texto de busca
 */
function filterNotes(searchText) {
  const noteItems = document.querySelectorAll('.note-item');
  const searchLower = searchText.toLowerCase();
  
  noteItems.forEach(item => {
    const noteText = item.querySelector('.note-text').textContent.toLowerCase();
    if (noteText.includes(searchLower)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// ============================
// SISTEMA DE CHECKLIST
// ============================

/**
 * Carrega checklist do usuário
 */
async function loadUserChecklist() {
  if (!supabaseClient || !currentUser) {
    // Se não estiver logado, carrega do localStorage
    loadChecklistFromLocalStorage();
    return;
  }
  
  try {
    const summaryId = getSummaryId();
    const { data, error } = await supabaseClient
      .from('checklist')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('summary_id', summaryId);
    
    if (error) {
      console.error('Erro ao carregar checklist:', error);
      loadChecklistFromLocalStorage();
      return;
    }
    
    if (data && data.length > 0) {
      checklistItems = data[0].items || [];
    } else {
      // Se não há checklist salvo, cria um novo baseado nos títulos
      generateChecklistFromTitles();
    }
    
    updateChecklistUI();
    console.log(`Checklist carregado com ${checklistItems.length} itens`);
  } catch (error) {
    console.error('Erro ao carregar checklist:', error);
    loadChecklistFromLocalStorage();
  }
}

/**
 * Salva checklist no Supabase
 */
async function saveUserChecklist() {
  if (!supabaseClient || !currentUser) {
    // Se não estiver logado, salva no localStorage
    saveChecklistToLocalStorage();
    return;
  }
  
  try {
    const summaryId = getSummaryId();
    const { error } = await supabaseClient
      .from('checklist')
      .upsert([
        {
          user_id: currentUser.id,
          summary_id: summaryId,
          items: checklistItems,
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Erro ao salvar checklist:', error);
      saveChecklistToLocalStorage();
      return;
    }
    
    console.log('Checklist salvo no Supabase');
  } catch (error) {
    console.error('Erro ao salvar checklist:', error);
    saveChecklistToLocalStorage();
  }
}

/**
 * Carrega checklist do localStorage
 */
function loadChecklistFromLocalStorage() {
  const summaryId = getSummaryId();
  const saved = localStorage.getItem(`checklist_${summaryId}`);
  if (saved) {
    checklistItems = JSON.parse(saved);
  } else {
    generateChecklistFromTitles();
  }
  updateChecklistUI();
}

/**
 * Salva checklist no localStorage
 */
function saveChecklistToLocalStorage() {
  const summaryId = getSummaryId();
  localStorage.setItem(`checklist_${summaryId}`, JSON.stringify(checklistItems));
}

/**
 * Gera checklist baseado nos títulos da página
 */
function generateChecklistFromTitles() {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5');
  checklistItems = [];
  
  headers.forEach((header, index) => {
    checklistItems.push({
      id: `item_${index}`,
      title: header.textContent.trim(),
      completed: false
    });
  });
  
  console.log(`Checklist gerado com ${checklistItems.length} itens`);
}

/**
 * Atualiza a interface do checklist
 */
function updateChecklistUI() {
  const checklistContainer = document.getElementById('checklist-items');
  const progressBar = document.getElementById('checklist-progress-bar');
  const progressText = document.getElementById('checklist-progress-text');
  
  if (!checklistContainer) return;
  
  checklistContainer.innerHTML = '';
  
  checklistItems.forEach(item => {
    const itemElement = createChecklistItemElement(item);
    checklistContainer.appendChild(itemElement);
  });
  
  // Atualiza progresso
  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${percentage}% concluído (${completedCount}/${totalCount})`;
  }
}

/**
 * Cria elemento HTML para item do checklist
 */
function createChecklistItemElement(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = `checklist-item ${item.completed ? 'completed' : ''}`;
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checklist-checkbox';
  checkbox.checked = item.completed;
  checkbox.onchange = () => toggleChecklistItem(item.id);
  
  const label = document.createElement('label');
  label.className = 'checklist-label';
  label.textContent = item.title;
  label.onclick = () => toggleChecklistItem(item.id);
  
  itemDiv.appendChild(checkbox);
  itemDiv.appendChild(label);
  
  return itemDiv;
}

/**
 * Alterna estado de um item do checklist
 */
function toggleChecklistItem(itemId) {
  const item = checklistItems.find(item => item.id === itemId);
  if (item) {
    item.completed = !item.completed;
    updateChecklistUI();
    saveUserChecklist();
  }
}

// ============================
// SISTEMA DE PREFERÊNCIAS
// ============================

/**
 * Carrega preferências do usuário
 */
async function loadUserPreferences() {
  if (!supabaseClient || !currentUser) {
    loadPreferencesFromLocalStorage();
    return;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao carregar preferências:', error);
      loadPreferencesFromLocalStorage();
      return;
    }
    
    if (data) {
      currentFontSize = data.font_size || 20;
      isDarkTheme = data.dark_theme || false;
      applyUserPreferences();
    } else {
      loadPreferencesFromLocalStorage();
    }
  } catch (error) {
    console.error('Erro ao carregar preferências:', error);
    loadPreferencesFromLocalStorage();
  }
}

/**
 * Salva preferências do usuário
 */
async function saveUserPreferences() {
  if (!supabaseClient || !currentUser) {
    savePreferencesToLocalStorage();
    return;
  }
  
  try {
    const { error } = await supabaseClient
      .from('user_preferences')
      .upsert([
        {
          user_id: currentUser.id,
          font_size: currentFontSize,
          dark_theme: isDarkTheme,
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Erro ao salvar preferências:', error);
      savePreferencesToLocalStorage();
      return;
    }
    
    console.log('Preferências salvas no Supabase');
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
    savePreferencesToLocalStorage();
  }
}

/**
 * Carrega preferências do localStorage
 */
function loadPreferencesFromLocalStorage() {
  currentFontSize = parseInt(localStorage.getItem('fontSize')) || 20;
  isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  applyUserPreferences();
}

/**
 * Salva preferências no localStorage
 */
function savePreferencesToLocalStorage() {
  localStorage.setItem('fontSize', currentFontSize.toString());
  localStorage.setItem('darkTheme', isDarkTheme.toString());
}

/**
 * Aplica preferências do usuário
 */
function applyUserPreferences() {
  // Aplica tamanho da fonte
  document.body.style.fontSize = `${currentFontSize}px`;
  
  // Aplica tema
  if (isDarkTheme) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  // Atualiza controles da interface
  updateFontSizeControls();
  updateThemeToggleButton();
}

/**
 * Atualiza controles de tamanho da fonte
 */
function updateFontSizeControls() {
  const slider = document.getElementById('font-size-slider');
  const display = document.getElementById('font-size-display');
  const preview = document.querySelector('.font-preview p');
  
  if (slider) slider.value = currentFontSize;
  if (display) display.textContent = `${currentFontSize}px`;
  if (preview) preview.style.fontSize = `${currentFontSize}px`;
}

/**
 * Atualiza botão de alternância de tema
 */
function updateThemeToggleButton() {
  const themeBtn = document.getElementById('theme-toggle-tool');
  if (themeBtn) {
    const icon = themeBtn.querySelector('.tool-icon');
    const label = themeBtn.querySelector('.tool-label');
    
    if (isDarkTheme) {
      if (icon) icon.textContent = '☀️';
      if (label) label.textContent = 'Modo Claro';
    } else {
      if (icon) icon.textContent = '🌙';
      if (label) label.textContent = 'Modo Escuro';
    }
  }
}

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

/**
 * Obtém ID único do resumo baseado no título ou URL
 */
function getSummaryId() {
  const title = document.querySelector('h0')?.textContent?.trim() || 
                document.title || 
                window.location.pathname;
  return btoa(title).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
}

/**
 * Obtém nome do arquivo atual para usar em emails
 */
function getCurrentFileName() {
  const path = window.location.pathname;
  const fileName = path.split('/').pop() || 'resumo';
  return fileName.replace('.html', '') || 'resumo';
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

// ============================
// FUNCIONALIDADES DE CONTATO E SUGESTÕES
// ============================

/**
 * Abre email de contato
 */
function openContactEmail() {
  const fileName = getCurrentFileName();
  const subject = `Contato sobre resumo: ${fileName}`;
  const body = `Olá,\n\nEstou entrando em contato sobre o resumo "${fileName}".\n\n[Digite sua mensagem aqui]\n\nObrigado!`;
  
  const mailtoLink = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink);
}

/**
 * Abre página de sugestão de edição no GitHub
 */
function openSuggestionPage() {
  const fileName = getCurrentFileName();
  const url = `${CONFIG.GITHUB_DISCUSSION_URL}&title=${encodeURIComponent(`Sugestão para: ${fileName}`)}`;
  window.open(url, '_blank');
}

// ============================
// FUNCIONALIDADES DE EXPORTAÇÃO PDF
// ============================

/**
 * Exporta conteúdo para PDF
 */
function exportToPDF() {
  showNotification('Preparando PDF...');
  
  // Cria uma nova janela com o conteúdo para impressão
  const printWindow = window.open('', '_blank');
  
  // Obtém o conteúdo principal
  const title = document.querySelector('h0')?.textContent || 'Resumo Médico';
  const content = document.body.innerHTML;
  
  // Cria HTML para impressão
  const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { 
          font-family: 'Garamond', serif; 
          font-size: 12pt; 
          line-height: 1.4; 
          margin: 20px;
          color: #000;
        }
        .floating-menu, .login-container, #sidebar, #toggle-btn, 
        #progress-container, .ai-modal, .tools-modal, .notes-sidebar,
        .checklist-modal, .font-modal, .ai-modal-overlay, 
        .tools-modal-overlay, .notes-sidebar-overlay,
        .checklist-modal-overlay, .font-modal-overlay { 
          display: none !important; 
        }
        h0, h1, h2, h3, h4, h5 { 
          color: #000; 
          page-break-after: avoid; 
        }
        .destaque { 
          background: #f0f0f0; 
          border-left: 4px solid #666; 
          padding: 10px; 
          margin: 10px 0; 
          page-break-inside: avoid; 
        }
        table { 
          border-collapse: collapse; 
          width: 100%; 
          page-break-inside: avoid; 
        }
        th, td { 
          border: 1px solid #666; 
          padding: 8px; 
        }
        th { 
          background: #f0f0f0; 
        }
        @page { 
          margin: 2cm; 
        }
      </style>
    </head>
    <body>
      ${content}
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10pt; color: #666;">
        <p><strong>Anotações do usuário:</strong></p>
        ${generateNotesForPDF()}
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printHTML);
  printWindow.document.close();
  
  // Aguarda carregar e abre diálogo de impressão
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
      showNotification('PDF gerado! Use Ctrl+P ou Cmd+P para salvar.');
    }, 500);
  };
}

/**
 * Gera HTML das anotações para incluir no PDF
 */
function generateNotesForPDF() {
  if (currentNotes.length === 0) {
    return '<p style="font-style: italic;">Nenhuma anotação encontrada.</p>';
  }
  
  let notesHTML = '<ul>';
  currentNotes.forEach(note => {
    const date = new Date(note.created_at).toLocaleDateString('pt-BR');
    notesHTML += `<li><strong>${date}:</strong> ${note.note}</li>`;
  });
  notesHTML += '</ul>';
  
  return notesHTML;
}

// ============================
// CONTROLE DE MODAIS
// ============================

/**
 * Abre modal genérico
 */
function openModal(modalId, overlayId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  
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

/**
 * Fecha modal genérico
 */
function closeModal(modalId, overlayId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  
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
 * Abre sidebar genérica
 */
function openSidebar(sidebarId, overlayId) {
  const sidebar = document.getElementById(sidebarId);
  const overlay = document.getElementById(overlayId);
  
  if (sidebar && overlay) {
    sidebar.classList.add('active');
    overlay.style.display = 'block';
    
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);
    
    if (isMobile()) {
      document.body.style.overflow = 'hidden';
    }
  }
}

/**
 * Fecha sidebar genérica
 */
function closeSidebar(sidebarId, overlayId) {
  const sidebar = document.getElementById(sidebarId);
  const overlay = document.getElementById(overlayId);
  
  if (sidebar && overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
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
  overlay.addEventListener('click', () => closeSidebar('sidebar', 'sidebar-overlay'));
  
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
        closeSidebar('sidebar', 'sidebar-overlay');
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
// CONTROLE DA SIDEBAR DO SUMÁRIO
// ============================

/**
 * Alterna visibilidade da sidebar do sumário
 */
function toggleSummarySidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (!sidebar) return;
  
  const isActive = sidebar.classList.contains('active');
  
  if (isActive) {
    closeSidebar('sidebar', 'sidebar-overlay');
  } else {
    openSidebar('sidebar', 'sidebar-overlay');
  }
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
  // Botão de toggle da sidebar do sumário
  const toggleBtn = document.getElementById('toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSummarySidebar);
    
    // Suporte a teclado
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSummarySidebar();
      }
    });
  }
  
  // Menu flutuante principal
  const mainFloatingBtn = document.getElementById('main-floating-btn');
  const floatingSubmenu = document.getElementById('floating-submenu');
  
  if (mainFloatingBtn && floatingSubmenu) {
    mainFloatingBtn.addEventListener('click', () => {
      mainFloatingBtn.classList.toggle('active');
      floatingSubmenu.classList.toggle('active');
    });
  }
  
  // Botões do submenu flutuante
  const aiAssistantBtn = document.getElementById('ai-assistant-btn');
  const contactBtn = document.getElementById('contact-btn');
  const suggestEditBtn = document.getElementById('suggest-edit-btn');
  const toolsBtn = document.getElementById('tools-btn');
  
  if (aiAssistantBtn) {
    aiAssistantBtn.addEventListener('click', () => {
      openModal('ai-modal', 'ai-modal-overlay');
      closeFloatingMenu();
    });
  }
  
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      openContactEmail();
      closeFloatingMenu();
    });
  }
  
  if (suggestEditBtn) {
    suggestEditBtn.addEventListener('click', () => {
      openSuggestionPage();
      closeFloatingMenu();
    });
  }
  
  if (toolsBtn) {
    toolsBtn.addEventListener('click', () => {
      openModal('tools-modal', 'tools-modal-overlay');
      closeFloatingMenu();
    });
  }
  
  // Botões de login/logout
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', loginWithGitHub);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Botões de ferramentas
  const checklistTool = document.getElementById('checklist-tool');
  const exportPdfTool = document.getElementById('export-pdf-tool');
  const themeToggleTool = document.getElementById('theme-toggle-tool');
  const fontSizeTool = document.getElementById('font-size-tool');
  const notesTool = document.getElementById('notes-tool');
  
  if (checklistTool) {
    checklistTool.addEventListener('click', () => {
      openModal('checklist-modal', 'checklist-modal-overlay');
      closeModal('tools-modal', 'tools-modal-overlay');
    });
  }
  
  if (exportPdfTool) {
    exportPdfTool.addEventListener('click', () => {
      exportToPDF();
      closeModal('tools-modal', 'tools-modal-overlay');
    });
  }
  
  if (themeToggleTool) {
    themeToggleTool.addEventListener('click', () => {
      toggleTheme();
      closeModal('tools-modal', 'tools-modal-overlay');
    });
  }
  
  if (fontSizeTool) {
    fontSizeTool.addEventListener('click', () => {
      openModal('font-modal', 'font-modal-overlay');
      closeModal('tools-modal', 'tools-modal-overlay');
    });
  }
  
  if (notesTool) {
    notesTool.addEventListener('click', () => {
      openSidebar('notes-sidebar', 'notes-sidebar-overlay');
      closeModal('tools-modal', 'tools-modal-overlay');
    });
  }
  
  // Controles de fonte
  const fontSlider = document.getElementById('font-size-slider');
  const fontDecrease = document.getElementById('font-decrease');
  const fontIncrease = document.getElementById('font-increase');
  
  if (fontSlider) {
    fontSlider.addEventListener('input', (e) => {
      changeFontSize(parseInt(e.target.value));
    });
  }
  
  if (fontDecrease) {
    fontDecrease.addEventListener('click', () => {
      changeFontSize(currentFontSize - 1);
    });
  }
  
  if (fontIncrease) {
    fontIncrease.addEventListener('click', () => {
      changeFontSize(currentFontSize + 1);
    });
  }
  
  // Controles de anotações
  const addNoteBtn = document.getElementById('add-note-btn');
  const notesSearchInput = document.getElementById('notes-search-input');
  
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', addNewNote);
  }
  
  if (notesSearchInput) {
    notesSearchInput.addEventListener('input', (e) => {
      filterNotes(e.target.value);
    });
  }
  
  // Botões de fechar modais
  setupModalCloseButtons();
  
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
        closeSidebar('sidebar', 'sidebar-overlay');
      }
    }
  });
  
  // Tecla ESC para fechar modais e sidebars
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModalsAndSidebars();
    }
  });
  
  // Seleção de texto na página
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);
  
  console.log('Event listeners configurados');
}

/**
 * Configura botões de fechar modais
 */
function setupModalCloseButtons() {
  // Modal do assistente IA
  const aiModalClose = document.getElementById('ai-modal-close');
  const aiModalOverlay = document.getElementById('ai-modal-overlay');
  
  if (aiModalClose) {
    aiModalClose.addEventListener('click', () => closeModal('ai-modal', 'ai-modal-overlay'));
  }
  
  if (aiModalOverlay) {
    aiModalOverlay.addEventListener('click', () => closeModal('ai-modal', 'ai-modal-overlay'));
  }
  
  // Modal de ferramentas
  const toolsModalClose = document.getElementById('tools-modal-close');
  const toolsModalOverlay = document.getElementById('tools-modal-overlay');
  
  if (toolsModalClose) {
    toolsModalClose.addEventListener('click', () => closeModal('tools-modal', 'tools-modal-overlay'));
  }
  
  if (toolsModalOverlay) {
    toolsModalOverlay.addEventListener('click', () => closeModal('tools-modal', 'tools-modal-overlay'));
  }
  
  // Modal de checklist
  const checklistModalClose = document.getElementById('checklist-modal-close');
  const checklistModalOverlay = document.getElementById('checklist-modal-overlay');
  
  if (checklistModalClose) {
    checklistModalClose.addEventListener('click', () => closeModal('checklist-modal', 'checklist-modal-overlay'));
  }
  
  if (checklistModalOverlay) {
    checklistModalOverlay.addEventListener('click', () => closeModal('checklist-modal', 'checklist-modal-overlay'));
  }
  
  // Modal de fonte
  const fontModalClose = document.getElementById('font-modal-close');
  const fontModalOverlay = document.getElementById('font-modal-overlay');
  
  if (fontModalClose) {
    fontModalClose.addEventListener('click', () => closeModal('font-modal', 'font-modal-overlay'));
  }
  
  if (fontModalOverlay) {
    fontModalOverlay.addEventListener('click', () => closeModal('font-modal', 'font-modal-overlay'));
  }
  
  // Sidebar de anotações
  const notesSidebarClose = document.getElementById('notes-sidebar-close');
  const notesSidebarOverlay = document.getElementById('notes-sidebar-overlay');
  
  if (notesSidebarClose) {
    notesSidebarClose.addEventListener('click', () => closeSidebar('notes-sidebar', 'notes-sidebar-overlay'));
  }
  
  if (notesSidebarOverlay) {
    notesSidebarOverlay.addEventListener('click', () => closeSidebar('notes-sidebar', 'notes-sidebar-overlay'));
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
}

/**
 * Fecha menu flutuante
 */
function closeFloatingMenu() {
  const mainFloatingBtn = document.getElementById('main-floating-btn');
  const floatingSubmenu = document.getElementById('floating-submenu');
  
  if (mainFloatingBtn) mainFloatingBtn.classList.remove('active');
  if (floatingSubmenu) floatingSubmenu.classList.remove('active');
}

/**
 * Fecha todos os modais e sidebars
 */
function closeAllModalsAndSidebars() {
  closeModal('ai-modal', 'ai-modal-overlay');
  closeModal('tools-modal', 'tools-modal-overlay');
  closeModal('checklist-modal', 'checklist-modal-overlay');
  closeModal('font-modal', 'font-modal-overlay');
  closeSidebar('notes-sidebar', 'notes-sidebar-overlay');
  closeSidebar('sidebar', 'sidebar-overlay');
  closeFloatingMenu();
}

/**
 * Alterna tema claro/escuro
 */
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyUserPreferences();
  saveUserPreferences();
  showNotification(`Tema ${isDarkTheme ? 'escuro' : 'claro'} ativado!`);
}

/**
 * Altera tamanho da fonte
 */
function changeFontSize(newSize) {
  currentFontSize = Math.max(14, Math.min(28, newSize));
  applyUserPreferences();
  saveUserPreferences();
}

/**
 * Inicialização principal do script
 */
function initializeApp() {
  console.log('Inicializando aplicação...');
  
  try {
    // 1. Inicializa Supabase
    initializeSupabase();
    
    // 2. Aplica cache bust nas imagens
    applyCacheBust();
    
    // 3. Cria elementos de interface dinamicamente
    createProgressBar();
    createToggleButton();
    createSidebar();
    
    // 4. Gera sumário automaticamente
    generateSummary();
    
    // 5. Configura event listeners
    setupEventListeners();
    
    // 6. Inicializa assistente IA
    initializeAIAssistant();
    
    // 7. Carrega preferências do usuário
    loadUserPreferences();
    
    // 8. Carrega checklist
    loadUserChecklist();
    
    // 9. Atualiza progresso inicial
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
  
  // Recarrega checklist
  loadUserChecklist();
  
  console.log('Aplicação reinicializada');
}

// Expõe funções globais para uso externo se necessário
window.MedicalResumeApp = {
  reinitialize,
  toggleSummarySidebar,
  updateProgress,
  generateSummary,
  loginWithGitHub,
  logout,
  saveNote,
  exportToPDF,
  toggleTheme,
  changeFontSize
};

console.log('Script do modelo de resumos médicos carregado');

