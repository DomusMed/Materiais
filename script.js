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
  SUPABASE_URL: 'https://awirwulznmvwzaljpnai.supabase.co', // Exemplo: 'https://xyzcompany.supabase.co'
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
    short: "Resuma o conteúdo em um parágrafo para revisão rápida (nível doutorado )",
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
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
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
async function editNote(noteId, currentText) {
  const newText = prompt('Editar anotação:', currentText);
  if (newText !== null && newText.trim() !== '') {
    await updateNote(noteId, newText);
  }
}

/**
 * Filtra anotações por texto
 */
function filterNotes(query) {
  const filteredNotes = currentNotes.filter(note => 
    note.note.toLowerCase().includes(query.toLowerCase()) ||
    note.text_selected.toLowerCase().includes(query.toLowerCase())
  );
  
  const notesList = document.getElementById('notes-list');
  if (!notesList) return;
  
  notesList.innerHTML = '';
  
  if (filteredNotes.length === 0) {
    notesList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhuma anotação encontrada</p>';
    return;
  }
  
  filteredNotes.forEach(note => {
    const noteElement = createNoteElement(note);
    notesList.appendChild(noteElement);
  });
}

// ============================
// SISTEMA DE CHECKLIST
// ============================

/**
 * Carrega o estado do checklist do Supabase ou localStorage
 */
async function loadUserChecklist() {
  if (currentUser) {
    // Tenta carregar do Supabase
    if (!supabaseClient) return;
    try {
      const summaryId = getSummaryId();
      const { data, error } = await supabaseClient
        .from('checklist')
        .select('items')
        .eq('user_id', currentUser.id)
        .eq('summary_id', summaryId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error('Erro ao carregar checklist do Supabase:', error);
      } else if (data) {
        checklistItems = data.items || [];
        console.log('Checklist carregado do Supabase.');
      } else {
        console.log('Nenhum checklist encontrado no Supabase para este usuário/resumo.');
        checklistItems = []; // Garante que esteja vazio se não houver dados
      }
    } catch (error) {
      console.error('Erro ao carregar checklist do Supabase:', error);
      checklistItems = [];
    }
  } else {
    // Carrega do localStorage se não logado
    const storedChecklist = localStorage.getItem('checklistItems_' + getSummaryId());
    if (storedChecklist) {
      checklistItems = JSON.parse(storedChecklist);
      console.log('Checklist carregado do localStorage.');
    } else {
      checklistItems = [];
    }
  }
  updateChecklistUI();
}

/**
 * Salva o estado do checklist no Supabase ou localStorage
 */
async function saveChecklist() {
  if (currentUser) {
    // Salva no Supabase
    if (!supabaseClient) return;
    try {
      const summaryId = getSummaryId();
      const { data, error } = await supabaseClient
        .from('checklist')
        .upsert(
          {
            user_id: currentUser.id,
            summary_id: summaryId,
            items: checklistItems,
            updated_at: new Date().toISOString()
          },
          { onConflict: ['user_id', 'summary_id'] }
        )
        .select();
      
      if (error) {
        console.error('Erro ao salvar checklist no Supabase:', error);
        showNotification('Erro ao salvar checklist');
      } else {
        console.log('Checklist salvo no Supabase.');
      }
    } catch (error) {
      console.error('Erro ao salvar checklist no Supabase:', error);
      showNotification('Erro ao salvar checklist');
    }
  } else {
    // Salva no localStorage se não logado
    localStorage.setItem('checklistItems_' + getSummaryId(), JSON.stringify(checklistItems));
    console.log('Checklist salvo no localStorage.');
  }
}

/**
 * Gera o checklist com base nos títulos do documento
 */
function generateChecklist() {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return [];

  const headings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const newChecklistItems = [];

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent.trim();
    // Verifica se o item já existe no checklist atual para preservar o estado 'completed'
    const existingItem = checklistItems.find(item => item.text === text && item.level === level);
    newChecklistItems.push({
      id: `item-${index}`,
      text: text,
      level: level,
      completed: existingItem ? existingItem.completed : false
    });
  });
  checklistItems = newChecklistItems;
  saveChecklist(); // Salva o checklist gerado (ou atualizado)
  return newChecklistItems;
}

/**
 * Atualiza a interface do checklist
 */
function updateChecklistUI() {
  const checklistContent = document.getElementById('checklist-content');
  if (!checklistContent) return;

  checklistContent.innerHTML = ''; // Limpa o conteúdo existente

  if (checklistItems.length === 0) {
    generateChecklist(); // Gera o checklist se estiver vazio
  }

  const ul = document.createElement('ul');
  ul.className = 'checklist-list';

  checklistItems.forEach(item => {
    const li = document.createElement('li');
    li.className = `checklist-item level-${item.level}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checklist-${item.id}`;
    checkbox.checked = item.completed;
    checkbox.onchange = () => toggleChecklistItem(item.id);

    const label = document.createElement('label');
    label.htmlFor = `checklist-${item.id}`;
    label.textContent = item.text;

    li.appendChild(checkbox);
    li.appendChild(label);
    ul.appendChild(li);
  });

  checklistContent.appendChild(ul);
}

/**
 * Alterna o estado de um item do checklist
 */
function toggleChecklistItem(id) {
  const item = checklistItems.find(item => item.id === id);
  if (item) {
    item.completed = !item.completed;
    saveChecklist();
    updateChecklistUI(); // Atualiza a UI para refletir a mudança
  }
}

// ============================
// EXPORTAR PDF
// ============================

/**
 * Exporta o conteúdo principal e anotações para PDF
 */
async function exportToPdf() {
  showNotification('Gerando PDF... Isso pode levar alguns segundos.');
  
  // Adiciona o CDN do jsPDF dinamicamente se ainda não estiver presente
  if (typeof jspdf === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = async ( ) => {
      await generatePdfContent();
    };
    script.onerror = () => {
      showNotification('Erro ao carregar jsPDF. Verifique sua conexão.');
      console.error('Erro ao carregar jsPDF CDN.');
    };
    document.head.appendChild(script);
  } else {
    await generatePdfContent();
  }
}

async function generatePdfContent() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const content = document.getElementById('content');
  const notesList = document.getElementById('notes-list');
  
  let yOffset = 10;
  const margin = 10;
  const lineHeight = 7;
  const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
  
  // Adicionar título do resumo
  doc.setFontSize(24);
  doc.text(document.title, margin, yOffset);
  yOffset += 10;
  
  // Adicionar data de exportação
  doc.setFontSize(10);
  doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, margin, yOffset);
  yOffset += 10;
  
  // Adicionar conteúdo principal
  doc.setFontSize(12);
  const contentText = content.innerText; // Pega todo o texto visível
  const splitContent = doc.splitTextToSize(contentText, maxWidth);
  
  for (const line of splitContent) {
    if (yOffset + lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yOffset = margin;
    }
    doc.text(line, margin, yOffset);
    yOffset += lineHeight;
  }
  
  // Adicionar anotações
  if (currentNotes.length > 0) {
    if (yOffset + 20 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yOffset = margin;
    }
    doc.setFontSize(18);
    doc.text('Minhas Anotações', margin, yOffset);
    yOffset += 10;
    
    doc.setFontSize(10);
    currentNotes.forEach(note => {
      const noteText = `"${note.text_selected}" - ${note.note} (${new Date(note.created_at).toLocaleDateString('pt-BR')})`;
      const splitNote = doc.splitTextToSize(noteText, maxWidth);
      
      for (const line of splitNote) {
        if (yOffset + lineHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yOffset = margin;
        }
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      }
      yOffset += 5; // Espaço entre as anotações
    });
  }
  
  // Salvar o PDF
  const filename = `Resumo_Medico_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
  showNotification('PDF gerado com sucesso!');
}

// ============================
// CONTROLES DE TEMA E FONTE
// ============================

/**
 * Carrega as preferências do usuário (tema e fonte) do Supabase ou localStorage
 */
async function loadUserPreferences() {
  if (currentUser) {
    // Tenta carregar do Supabase
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('user_preferences')
        .select('theme, font_size')
        .eq('user_id', currentUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error('Erro ao carregar preferências do Supabase:', error);
      } else if (data) {
        isDarkTheme = data.theme === 'dark';
        currentFontSize = data.font_size || 20;
        console.log('Preferências carregadas do Supabase.');
      } else {
        console.log('Nenhuma preferência encontrada no Supabase para este usuário.');
      }
    } catch (error) {
      console.error('Erro ao carregar preferências do Supabase:', error);
    }
  } else {
    // Carrega do localStorage se não logado
    const storedTheme = localStorage.getItem('themePreference');
    if (storedTheme) {
      isDarkTheme = storedTheme === 'dark';
    }
    const storedFontSize = localStorage.getItem('fontSizePreference');
    if (storedFontSize) {
      currentFontSize = parseInt(storedFontSize);
    }
  }
  applyTheme();
  applyFontSize();
}

/**
 * Salva as preferências do usuário (tema e fonte) no Supabase ou localStorage
 */
async function saveUserPreferences() {
  if (currentUser) {
    // Salva no Supabase
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('user_preferences')
        .upsert(
          {
            user_id: currentUser.id,
            theme: isDarkTheme ? 'dark' : 'light',
            font_size: currentFontSize,
            updated_at: new Date().toISOString()
          },
          { onConflict: ['user_id'] }
        )
        .select();
      
      if (error) {
        console.error('Erro ao salvar preferências no Supabase:', error);
        showNotification('Erro ao salvar preferências');
      } else {
        console.log('Preferências salvas no Supabase.');
      }
    } catch (error) {
      console.error('Erro ao salvar preferências no Supabase:', error);
      showNotification('Erro ao salvar preferências');
    }
  } else {
    // Salva no localStorage se não logado
    localStorage.setItem('themePreference', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('fontSizePreference', currentFontSize.toString());
  }
}

/**
 * Aplica o tema (claro/escuro)
 */
function applyTheme() {
  const body = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (isDarkTheme) {
    body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }
}

/**
 * Alterna o tema
 */
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  saveUserPreferences();
}

/**
 * Aplica o tamanho da fonte
 */
function applyFontSize() {
  document.body.style.fontSize = `${currentFontSize}px`;
}

/**
 * Ajusta o tamanho da fonte
 */
function adjustFontSize(delta) {
  currentFontSize = Math.max(14, Math.min(30, currentFontSize + delta)); // Limita entre 14px e 30px
  applyFontSize();
  saveUserPreferences();
}

// ============================
// UI/UX E EVENT LISTENERS
// ============================

/**
 * Exibe notificações temporárias
 */
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

/**
 * Inicializa a barra de progresso de leitura
 */
function initializeProgressBar() {
  const contentDiv = document.getElementById('content');
  const progressBar = document.getElementById('progress-bar');
  const timeToReadSpan = document.getElementById('time-to-read');

  if (!contentDiv || !progressBar || !timeToReadSpan) return;

  const text = contentDiv.innerText;
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const timeToRead = Math.ceil(wordCount / CONFIG.WPM);
  timeToReadSpan.textContent = `${timeToRead}min`;

  const updateProgress = () => {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%
  `;
  };

  window.addEventListener('scroll', updateProgress);
  updateProgress(); // Chamada inicial para definir o progresso ao carregar a página
}

/**
 * Inicializa o botão flutuante e seus sub-botões
 */
function initializeFloatingButton() {
  const floatingButton = document.getElementById('floating-button');
  const subButtons = document.getElementById('sub-buttons');
  const iaButton = document.getElementById('ia-button');
  const suggestEditButton = document.getElementById('suggest-edit-button');
  const contactButton = document.getElementById('contact-button');
  const toolsButton = document.getElementById('tools-button');
  const notesSidebar = document.getElementById('notes-sidebar');
  const iaAssistantModal = document.getElementById('ia-assistant-modal');
  const iaAssistantCloseBtn = document.getElementById('ia-assistant-close-btn');
  const iaAssistantPlatformSelect = document.getElementById('ia-assistant-platform-select');
  const iaAssistantQuestionInput = document.getElementById('ia-assistant-question-input');
  const iaAssistantSendBtn = document.getElementById('ia-assistant-send-btn');
  const iaAssistantPredefinedQuestions = document.getElementById('ia-assistant-predefined-questions');
  const notesSidebarCloseBtn = document.getElementById('notes-sidebar-close-btn');
  const notesSearchInput = document.getElementById('notes-search-input');
  const exportPdfButton = document.getElementById('export-pdf-button');
  const checklistButton = document.getElementById('checklist-button');
  const checklistModal = document.getElementById('checklist-modal');
  const checklistCloseBtn = document.getElementById('checklist-close-btn');

  let subButtonsVisible = false;

  // Evento de clique no botão flutuante principal
  floatingButton.addEventListener('click', () => {
    subButtonsVisible = !subButtonsVisible;
    if (subButtonsVisible) {
      subButtons.classList.add('visible');
    } else {
      subButtons.classList.remove('visible');
    }
  });

  // Evento de clique no botão IA
  iaButton.addEventListener('click', () => {
    iaAssistantModal.classList.add('visible');
    // Preenche as plataformas de IA
    iaAssistantPlatformSelect.innerHTML = '';
    for (const platform in AI_PLATFORMS) {
      const btn = document.createElement('button');
      btn.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
      btn.setAttribute('data-platform', platform);
      btn.addEventListener('click', () => {
        currentPlatform = platform;
        // Remove a classe 'active' de todos os botões
        Array.from(iaAssistantPlatformSelect.children).forEach(b => b.classList.remove('active'));
        // Adiciona a classe 'active' ao botão clicado
        btn.classList.add('active');
      });
      iaAssistantPlatformSelect.appendChild(btn);
    }
    // Seleciona a primeira plataforma por padrão
    if (iaAssistantPlatformSelect.children.length > 0) {
      iaAssistantPlatformSelect.children[0].classList.add('active');
      currentPlatform = iaAssistantPlatformSelect.children[0].getAttribute('data-platform');
    }

    // Preenche as perguntas pré-formuladas
    iaAssistantPredefinedQuestions.innerHTML = '';
    PREDEFINED_QUESTIONS.forEach(q => {
      const btn = document.createElement('button');
      btn.textContent = q.short;
      btn.title = q.detailed; // Tooltip com a versão detalhada
      btn.addEventListener('click', () => {
        iaAssistantQuestionInput.value = q.detailed;
      });
      iaAssistantPredefinedQuestions.appendChild(btn);
    });
  });

  // Evento de clique no botão fechar do assistente IA
  iaAssistantCloseBtn.addEventListener('click', () => {
    iaAssistantModal.classList.remove('visible');
  });

  // Evento de clique no botão enviar pergunta do assistente IA
  iaAssistantSendBtn.addEventListener('click', () => {
    const question = iaAssistantQuestionInput.value.trim();
    if (question) {
      const platformUrl = AI_PLATFORMS[currentPlatform];
      if (platformUrl) {
        const fullUrl = `${platformUrl}?q=${encodeURIComponent(question)}`;
        window.open(fullUrl, '_blank');
        showNotification(`Abrindo ${currentPlatform} com sua pergunta!`);
      } else {
        showNotification('Plataforma de IA não reconhecida.');
      }
    } else {
      showNotification('Por favor, digite sua pergunta.');
    }
  });

  // Evento de clique no botão Sugerir edição
  suggestEditButton.addEventListener('click', () => {
    window.open(CONFIG.GITHUB_DISCUSSION_URL, '_blank');
  });

  // Evento de clique no botão Entre em contato
  contactButton.addEventListener('click', () => {
    const subject = encodeURIComponent('Contato sobre o resumo: ' + document.title);
    const body = encodeURIComponent(
      'Olá, \n\nEstou entrando em contato sobre o resumo: ' + document.title + 
      '\nURL: ' + window.location.href + 
      '\n\n[Descreva sua mensagem aqui]\n\nAtenciosamente,\n[Seu Nome]' 
    );
    window.location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });

  // Evento de clique no botão Ferramentas (abre a sidebar de anotações)
  toolsButton.addEventListener('click', () => {
    notesSidebar.classList.add('visible');
    loadUserNotes(); // Carrega as anotações ao abrir a sidebar
  });

  // Evento de clique no botão fechar da sidebar de anotações
  notesSidebarCloseBtn.addEventListener('click', () => {
    notesSidebar.classList.remove('visible');
  });

  // Evento de busca de anotações
  notesSearchInput.addEventListener('input', (e) => {
    filterNotes(e.target.value);
  });

  // Evento de clique no botão Exportar PDF
  exportPdfButton.addEventListener('click', exportToPdf);

  // Evento de clique no botão Checklist
  checklistButton.addEventListener('click', () => {
    checklistModal.classList.add('visible');
    updateChecklistUI();
  });

  // Evento de clique no botão fechar do checklist
  checklistCloseBtn.addEventListener('click', () => {
    checklistModal.classList.remove('visible');
  });
}

/**
 * Inicializa os controles de tema e fonte
 */
function initializeThemeAndFontControls() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const fontSmallBtn = document.getElementById('font-small-btn');
  const fontMediumBtn = document.getElementById('font-medium-btn');
  const fontLargeBtn = document.getElementById('font-large-btn');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (fontSmallBtn) {
    fontSmallBtn.addEventListener('click', () => adjustFontSize(-2));
  }
  if (fontMediumBtn) {
    fontMediumBtn.addEventListener('click', () => adjustFontSize(0)); // Volta ao tamanho padrão
  }
  if (fontLargeBtn) {
    fontLargeBtn.addEventListener('click', () => adjustFontSize(2));
  }
}

/**
 * Inicializa o sistema de anotações por seleção de texto
 */
function initializeNoteTaking() {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;

  contentDiv.addEventListener('mouseup', (event) => {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      // Cria um modal ou um prompt para a anotação
      const note = prompt(`Anotar sobre: "${selectedText}"\n\nDigite sua anotação:`);
      if (note !== null && note.trim() !== '') {
        saveNote(note, selectedText);
      }
      selection.removeAllRanges(); // Limpa a seleção
    }
  });
}

/**
 * Retorna um ID único para o resumo atual (baseado na URL)
 */
function getSummaryId() {
  // Usa o pathname como ID, removendo o .html
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
}

// ============================
// INICIALIZAÇÃO GERAL
// ============================

document.addEventListener('DOMContentLoaded', () => {
  initializeSupabase();
  initializeProgressBar();
  initializeFloatingButton();
  initializeThemeAndFontControls();
  initializeNoteTaking();
  
  // Carrega preferências e checklist na inicialização
  loadUserPreferences();
  loadUserChecklist();
});
