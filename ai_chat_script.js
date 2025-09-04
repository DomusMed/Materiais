/**
 * ============================
 * SCRIPT DO CHAT DE IA INTERATIVO
 * ============================
 * 
 * Este script contém toda a lógica para:
 * - Controle da janela de chat flutuante
 * - Detecção e captura de texto selecionado
 * - Perguntas pré-definidas e ações rápidas
 * - Simulação de respostas da IA
 * - Interface responsiva e acessível
 * 
 * Adicione este código ao final do seu script.js existente
 * ou inclua como um arquivo JavaScript separado
 */

// ============================
// CONFIGURAÇÕES DO CHAT DE IA
// ============================

const AI_CHAT_CONFIG = {
  TYPING_SPEED: 30, // Velocidade de digitação da IA (ms por caractere)
  MAX_MESSAGE_LENGTH: 1000, // Tamanho máximo da mensagem
  SELECTION_MIN_LENGTH: 10, // Tamanho mínimo para considerar seleção válida
  MOBILE_BREAKPOINT: 768, // Breakpoint para dispositivos móveis
  AUTO_SCROLL_DELAY: 100 // Delay para auto-scroll das mensagens
};

// ============================
// ESTADO GLOBAL DO CHAT
// ============================

const aiChatState = {
  isOpen: false,
  selectedText: '',
  isTyping: false,
  messageHistory: [],
  currentSelection: null
};

// ============================
// RESPOSTAS SIMULADAS DA IA
// ============================

const AI_RESPONSES = {
  // Respostas para perguntas pré-definidas
  'Resuma os pontos principais desta página': `
📋 **Resumo dos Pontos Principais - Síndrome Ictérica:**

🔸 **Definição**: Icterícia é a coloração amarelada da pele e mucosas devido ao acúmulo de bilirrubina (>2,5-3,0 mg/dL)

🔸 **Formação**: A bilirrubina vem da degradação da hemoglobina das hemácias senescentes

🔸 **Metabolismo**: Captação → Conjugação (GT) → Excreção no fígado

🔸 **Classificação**:
   • **Bilirrubina Indireta ↑**: Hemólise ou distúrbios do metabolismo
   • **Bilirrubina Direta ↑**: Hepatites, colestase ou distúrbios da excreção

🔸 **Síndromes Importantes**:
   • **Gilbert**: Deficiência leve da GT, benigna
   • **Crigler-Najjar**: Deficiência grave da GT, pode causar kernicterus
  `,

  'Quais são os conceitos mais importantes para memorizar?': `
🧠 **Conceitos High-Yield para Memorizar:**

🎯 **Valores Laboratoriais Críticos**:
   • Icterícia visível: Bilirrubina >2,5-3,0 mg/dL
   • Hepatite: TGO/TGP >10x LSN
   • Colestase: FA/GGT >3-4x LSN

🎯 **Diferenciação Rápida**:
   • **TGO > TGP (2:1)** = Hepatite alcoólica
   • **TGO/TGP > 1000** = Viral, isquemia ou drogas
   • **Colúria + Acolia** = Bilirrubina direta ↑

🎯 **Síndromes Genéticas**:
   • **Gilbert**: Fenobarbital melhora, benigna
   • **Crigler-Najjar Tipo 1**: Fenobarbital não funciona, transplante
   • **Crigler-Najjar Tipo 2**: Fenobarbital funciona

🎯 **Sinais de Hemólise**:
   • Anemia + Reticulocitose + ↑LDH + ↓Haptoglobina
  `,

  'Crie perguntas de revisão sobre este conteúdo': `
❓ **Perguntas de Revisão - Síndrome Ictérica:**

**1. Clínica Básica:**
• A partir de qual valor de bilirrubina a icterícia se torna visível?
• Qual a progressão típica da icterícia no corpo?

**2. Laboratório:**
• Como diferenciar hepatite de colestase pelos exames?
• O que sugere TGO > TGP na proporção 2:1?

**3. Diagnóstico Diferencial:**
• Quais os 4 sinais laboratoriais de hemólise?
• Quando suspeitar de Síndrome de Gilbert?

**4. Casos Clínicos:**
• Paciente com bilirrubina 25 mg/dL no RN. Fenobarbital não melhora. Diagnóstico?
• Adulto jovem com icterícia intermitente, bilirrubina 3,5 mg/dL, enzimas normais. Diagnóstico mais provável?

**5. Tratamento:**
• Qual a única cura para Crigler-Najjar Tipo 1?
• O que pode precipitar icterícia na Síndrome de Gilbert?
  `,

  'Explique as diferenças entre os tipos de icterícia': `
🔍 **Diferenças Entre os Tipos de Icterícia:**

## **🟡 Bilirrubina INDIRETA ↑**

**🩸 Hemólise:**
• Anemia + Reticulocitose
• ↑ LDH, ↓ Haptoglobina
• Causa: Destruição excessiva de hemácias

**🧬 Distúrbios Metabólicos:**
• SEM anemia
• Enzimas hepáticas normais
• Ex: Gilbert, Crigler-Najjar

---

## **🟠 Bilirrubina DIRETA ↑**

**🏥 Hepatites:**
• TGO/TGP >10x LSN
• FA/GGT "tocadas" (pouco elevadas)
• Lesão dos hepatócitos

**🚫 Colestase:**
• FA/GGT >3-4x LSN  
• TGO/TGP "tocadas"
• Obstrução do fluxo biliar
• Colúria + Acolia + Prurido

**🧬 Distúrbios da Excreção:**
• Enzimas normais
• Ex: Dubin-Johnson, Rotor

---

**💡 Dica Prática:** 
Bilirrubina indireta = problema ANTES do fígado ou NA conjugação
Bilirrubina direta = problema NA excreção ou DEPOIS do fígado
  `
};

// Respostas para ações com texto selecionado
const AI_SELECTION_RESPONSES = {
  'explain-child': (text) => `
👶 **Explicação para Criança de 8 anos:**

Imagine que seu corpo é como uma fábrica que precisa limpar a "sujeira" do sangue. 

${text.length > 100 ? 'O texto que você selecionou fala sobre' : 'Sobre o que você selecionou:'} como nosso corpo fica amarelinho (icterícia) quando essa limpeza não funciona direito.

É como quando você come muito cenoura e fica meio laranjinha, mas aqui é por causa de uma substância chamada bilirrubina que não consegue sair do corpo direito.

O fígado é como um filtro super importante que ajuda a limpar essa "tinta amarela" do sangue. Quando ele não consegue fazer isso bem, a pessoa fica com a pele e os olhos amarelados.

Não é contagioso e na maioria das vezes os médicos conseguem descobrir o que está acontecendo e ajudar! 😊
  `,

  'explain-phd': (text) => `
🎓 **Análise em Nível Doutorado:**

**Contexto Fisiopatológico Avançado:**

O fragmento selecionado aborda aspectos fundamentais da homeostase da bilirrubina e suas implicações clínicas. A compreensão molecular envolve:

**Bioquímica Molecular:**
• Atividade da UDP-glicuroniltransferase (UGT1A1) e polimorfismos genéticos
• Transportadores hepatocitários: OATP1B1/1B3 (captação) e MRP2/ABCC2 (excreção)
• Regulação transcricional por CAR/PXR e fatores de jejum

**Correlações Clínico-Laboratoriais:**
• Cinética enzimática da conjugação vs. capacidade excretora
• Impacto da ligação albumina-bilirrubina na distribuição tecidual
• Biomarcadores diferenciais: δ-bilirrubina em colestase crônica

**Implicações Terapêuticas:**
• Modulação farmacológica da UGT1A1 (fenobarbital, rifampicina)
• Terapia gênica experimental para deficiências enzimáticas
• Fotoisomerização e mecanismos de clearance alternativo

**Relevância Translacional:**
Esta base fisiopatológica fundamenta abordagens diagnósticas precision medicine e estratégias terapêuticas personalizadas baseadas no genótipo UGT1A1.
  `,

  'clinical-case': (text) => `
🏥 **Caso Clínico para Diagnóstico Diferencial:**

**📋 Apresentação do Caso:**

**Paciente:** João, 22 anos, estudante de medicina

**Queixa Principal:** "Doutor, meus amigos notaram que meus olhos estão amarelados há 3 dias"

**HDA:** Paciente refere que após uma semana de provas finais (muito estresse + pouco sono + alimentação irregular), desenvolveu icterícia. Nega dor abdominal, febre, colúria ou acolia. Relata episódios similares mais leves durante períodos de estresse.

**Exame Físico:** 
• Icterícia leve em escleras
• Abdome: fígado não palpável, sem dor
• Sem linfonodomegalias

**Exames Laboratoriais:**
• Bilirrubina Total: 3,2 mg/dL (Indireta: 2,8 / Direta: 0,4)
• TGO: 28 U/L (normal)  
• TGP: 32 U/L (normal)
• FA: 85 U/L (normal)
• Hemoglobina: 14,2 g/dL
• Reticulócitos: 1,2% (normal)

**🤔 Perguntas para Reflexão:**

1. Qual o diagnóstico mais provável?
2. Que teste confirmatório você solicitaria?
3. Qual orientação dar ao paciente?
4. Há necessidade de seguimento?

**💡 High-Yield Facts:**
• Icterícia + stress + exames normais + bilirrubina indireta
• Padrão intermitente em adulto jovem
• Ausência de hemólise (reticulócitos normais)
  `
};

// ============================
// UTILITÁRIOS DO CHAT
// ============================

/**
 * Verifica se é dispositivo móvel
 */
function isAiChatMobile() {
  return window.innerWidth <= AI_CHAT_CONFIG.MOBILE_BREAKPOINT;
}

/**
 * Gera ID único para mensagens
 */
function generateMessageId() {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Sanitiza texto para prevenir XSS
 */
function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formata texto com markdown simples
 */
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

/**
 * Auto-scroll para a última mensagem
 */
function scrollToBottom() {
  setTimeout(() => {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, AI_CHAT_CONFIG.AUTO_SCROLL_DELAY);
}

// ============================
// CONTROLE DA JANELA DE CHAT
// ============================

/**
 * Inicializa o chat de IA
 */
function initializeAiChat() {
  console.log('Inicializando Chat de IA...');
  
  // Verifica se os elementos já existem
  if (document.getElementById('ai-chat-toggle')) {
    console.log('Chat de IA já inicializado');
    return;
  }
  
  try {
    // Cria elementos dinamicamente se não existirem no HTML
    createAiChatElements();
    
    // Configura event listeners
    setupAiChatEventListeners();
    
    // Configura detecção de seleção de texto
    setupTextSelection();
    
    console.log('Chat de IA inicializado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao inicializar Chat de IA:', error);
  }
}

/**
 * Cria elementos do chat dinamicamente (caso não estejam no HTML)
 */
function createAiChatElements() {
  // Esta função pode ser usada se os elementos não forem adicionados diretamente no HTML
  // Por enquanto, assumimos que os elementos estão no HTML fornecido
}

/**
 * Abre a janela do chat
 */
function openAiChat() {
  const chatWindow = document.getElementById('ai-chat-window');
  const overlay = document.getElementById('ai-chat-overlay');
  
  if (chatWindow) {
    chatWindow.classList.add('active');
    chatWindow.setAttribute('aria-hidden', 'false');
  }
  
  if (overlay && isAiChatMobile()) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Previne scroll em mobile
  }
  
  aiChatState.isOpen = true;
  
  // Foca no input
  setTimeout(() => {
    const input = document.getElementById('ai-chat-input');
    if (input) input.focus();
  }, 300);
  
  console.log('Chat de IA aberto');
}

/**
 * Fecha a janela do chat
 */
function closeAiChat() {
  const chatWindow = document.getElementById('ai-chat-window');
  const overlay = document.getElementById('ai-chat-overlay');
  
  if (chatWindow) {
    chatWindow.classList.remove('active');
    chatWindow.setAttribute('aria-hidden', 'true');
  }
  
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaura scroll
  }
  
  aiChatState.isOpen = false;
  
  console.log('Chat de IA fechado');
}

/**
 * Alterna visibilidade do chat
 */
function toggleAiChat() {
  if (aiChatState.isOpen) {
    closeAiChat();
  } else {
    openAiChat();
  }
}

// ============================
// SISTEMA DE MENSAGENS
// ============================

/**
 * Adiciona mensagem do usuário
 */
function addUserMessage(text) {
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return;
  
  const messageId = generateMessageId();
  const messageDiv = document.createElement('div');
  messageDiv.className = 'user-message';
  messageDiv.id = messageId;
  
  messageDiv.innerHTML = `
    <div class="user-message-avatar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="user-message-content">
      <p>${sanitizeText(text)}</p>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  
  // Adiciona ao histórico
  aiChatState.messageHistory.push({
    id: messageId,
    type: 'user',
    text: text,
    timestamp: new Date()
  });
  
  scrollToBottom();
}

/**
 * Adiciona mensagem da IA com efeito de digitação
 */
function addAiMessage(text) {
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return;
  
  const messageId = generateMessageId();
  const messageDiv = document.createElement('div');
  messageDiv.className = 'ai-message';
  messageDiv.id = messageId;
  
  messageDiv.innerHTML = `
    <div class="ai-message-avatar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 9h.01M15 9h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="ai-message-content">
      <p></p>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
  
  // Efeito de digitação
  const contentElement = messageDiv.querySelector('.ai-message-content p');
  typeMessage(contentElement, text, () => {
    // Adiciona ao histórico após completar a digitação
    aiChatState.messageHistory.push({
      id: messageId,
      type: 'ai',
      text: text,
      timestamp: new Date()
    });
  });
}

/**
 * Simula digitação da IA
 */
function typeMessage(element, text, callback) {
  aiChatState.isTyping = true;
  showLoading(true);
  
  // Delay inicial para simular "pensamento"
  setTimeout(() => {
    showLoading(false);
    
    const formattedText = formatMessage(text);
    let index = 0;
    
    function typeChar() {
      if (index < formattedText.length) {
        element.innerHTML = formattedText.substring(0, index + 1);
        index++;
        scrollToBottom();
        setTimeout(typeChar, AI_CHAT_CONFIG.TYPING_SPEED);
      } else {
        aiChatState.isTyping = false;
        if (callback) callback();
      }
    }
    
    typeChar();
  }, 1000 + Math.random() * 1000); // 1-2 segundos de delay
}

/**
 * Mostra/esconde indicador de carregamento
 */
function showLoading(show) {
  const loading = document.getElementById('ai-loading');
  if (loading) {
    loading.style.display = show ? 'flex' : 'none';
  }
}

// ============================
// DETECÇÃO DE TEXTO SELECIONADO
// ============================

/**
 * Configura detecção de seleção de texto
 */
function setupTextSelection() {
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);
}

/**
 * Manipula seleção de texto
 */
function handleTextSelection() {
  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length >= AI_CHAT_CONFIG.SELECTION_MIN_LENGTH) {
      showSelectedText(selectedText);
      aiChatState.selectedText = selectedText;
      aiChatState.currentSelection = selection;
    } else {
      hideSelectedText();
    }
  }, 100);
}

/**
 * Mostra área de texto selecionado
 */
function showSelectedText(text) {
  const selectedTextDiv = document.getElementById('ai-selected-text');
  const selectedTextContent = document.getElementById('ai-selected-text-content');
  
  if (selectedTextDiv && selectedTextContent) {
    selectedTextContent.textContent = text.length > 200 ? text.substring(0, 200) + '...' : text;
    selectedTextDiv.style.display = 'block';
    
    // Auto-abre o chat se não estiver aberto
    if (!aiChatState.isOpen) {
      openAiChat();
    }
  }
}

/**
 * Esconde área de texto selecionado
 */
function hideSelectedText() {
  const selectedTextDiv = document.getElementById('ai-selected-text');
  if (selectedTextDiv) {
    selectedTextDiv.style.display = 'none';
  }
  aiChatState.selectedText = '';
  aiChatState.currentSelection = null;
}

// ============================
// PROCESSAMENTO DE PERGUNTAS
// ============================

/**
 * Processa pergunta do usuário
 */
function processUserQuestion(question) {
  if (!question.trim()) return;
  
  // Adiciona mensagem do usuário
  addUserMessage(question);
  
  // Limpa input
  const input = document.getElementById('ai-chat-input');
  if (input) {
    input.value = '';
    input.style.height = 'auto';
  }
  
  // Gera resposta da IA
  generateAiResponse(question);
}

/**
 * Gera resposta da IA baseada na pergunta
 */
function generateAiResponse(question) {
  let response = '';
  
  // Verifica se é uma pergunta pré-definida
  const predefinedResponse = AI_RESPONSES[question];
  if (predefinedResponse) {
    response = predefinedResponse;
  } else {
    // Resposta genérica personalizada
    response = generateGenericResponse(question);
  }
  
  // Adiciona resposta da IA
  addAiMessage(response);
}

/**
 * Gera resposta genérica baseada no contexto
 */
function generateGenericResponse(question) {
  const responses = [
    `Obrigado pela sua pergunta sobre "${question}". Com base no conteúdo desta página sobre Síndrome Ictérica, posso ajudá-lo a entender melhor este tópico. 

🔍 **Análise da sua pergunta:**
Sua questão se relaciona com os conceitos fundamentais de icterícia e metabolismo da bilirrubina apresentados nesta página.

💡 **Pontos relevantes:**
• A icterícia é um sinal clínico importante que indica problemas no metabolismo da bilirrubina
• A classificação entre bilirrubina direta e indireta é fundamental para o diagnóstico diferencial
• Os exames laboratoriais são essenciais para determinar a causa subjacente

📚 **Sugestão de estudo:**
Recomendo revisar especialmente as seções sobre classificação da icterícia e os distúrbios do metabolismo da bilirrubina para uma compreensão mais completa.

Gostaria que eu explique algum ponto específico em mais detalhes?`,

    `Interessante pergunta! Vou relacioná-la com o conteúdo sobre Síndrome Ictérica desta página.

🎯 **Contexto da sua pergunta:**
"${question}" - Esta questão toca em aspectos importantes do diagnóstico diferencial da icterícia.

📋 **Pontos-chave para considerar:**
• O tipo de bilirrubina elevada (direta vs indireta) orienta o diagnóstico
• Os padrões laboratoriais (hepatocelular vs colestático) são fundamentais
• A história clínica e exame físico complementam a investigação

🧠 **Para fixar o conhecimento:**
Lembre-se sempre da sequência: Captação → Conjugação → Excreção no metabolismo da bilirrubina.

Posso elaborar mais sobre algum aspecto específico que mencionei?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Processa ação com texto selecionado
 */
function processSelectionAction(action) {
  if (!aiChatState.selectedText) return;
  
  const actionTexts = {
    'explain-child': 'Explique-me este conteúdo como se eu fosse uma criança de 8 anos de idade',
    'explain-phd': 'Explique-me este conteúdo de forma breve em nível doutorado',
    'clinical-case': 'Crie um breve caso clínico para o diagnóstico diferencial desta condição, destacando pontos high yield facts'
  };
  
  const questionText = `${actionTexts[action]}: "${aiChatState.selectedText.substring(0, 100)}${aiChatState.selectedText.length > 100 ? '...' : ''}"`;
  
  // Adiciona pergunta do usuário
  addUserMessage(questionText);
  
  // Gera resposta específica
  const responseGenerator = AI_SELECTION_RESPONSES[action];
  if (responseGenerator) {
    const response = responseGenerator(aiChatState.selectedText);
    addAiMessage(response);
  }
  
  // Limpa seleção
  hideSelectedText();
}

// ============================
// EVENT LISTENERS
// ============================

/**
 * Configura todos os event listeners do chat
 */
function setupAiChatEventListeners() {
  // Botão de toggle do chat
  const toggleBtn = document.getElementById('ai-chat-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleAiChat);
  }
  
  // Botão de fechar
  const closeBtn = document.getElementById('ai-chat-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAiChat);
  }
  
  // Overlay para fechar em mobile
  const overlay = document.getElementById('ai-chat-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeAiChat);
  }
  
  // Input de texto
  const input = document.getElementById('ai-chat-input');
  if (input) {
    // Auto-resize do textarea
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Enter para enviar (Shift+Enter para nova linha)
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Botão de enviar
  const sendBtn = document.getElementById('ai-chat-send');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // Perguntas rápidas
  const quickQuestions = document.querySelectorAll('.ai-quick-question');
  quickQuestions.forEach(btn => {
    btn.addEventListener('click', function() {
      const question = this.getAttribute('data-question');
      processUserQuestion(question);
    });
  });
  
  // Ações com texto selecionado
  const actionBtns = document.querySelectorAll('.ai-action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      processSelectionAction(action);
    });
  });
  
  // Limpar seleção
  const clearSelectionBtn = document.getElementById('ai-clear-selection');
  if (clearSelectionBtn) {
    clearSelectionBtn.addEventListener('click', hideSelectedText);
  }
  
  // Tecla ESC para fechar
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && aiChatState.isOpen) {
      closeAiChat();
    }
  });
  
  // Redimensionamento da janela
  window.addEventListener('resize', function() {
    if (!isAiChatMobile() && aiChatState.isOpen) {
      const overlay = document.getElementById('ai-chat-overlay');
      if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

/**
 * Envia mensagem do input
 */
function sendMessage() {
  const input = document.getElementById('ai-chat-input');
  if (!input || aiChatState.isTyping) return;
  
  const message = input.value.trim();
  if (message) {
    processUserQuestion(message);
  }
}

// ============================
// INICIALIZAÇÃO
// ============================

/**
 * Inicializa o chat quando o DOM estiver pronto
 */
function initAiChatWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAiChat);
  } else {
    initializeAiChat();
  }
}

// Adiciona à inicialização existente do script principal
if (typeof initializeApp === 'function') {
  // Se existe a função de inicialização principal, adiciona o chat a ela
  const originalInit = initializeApp;
  initializeApp = function() {
    originalInit();
    initializeAiChat();
  };
} else {
  // Se não existe, inicializa apenas o chat
  initAiChatWhenReady();
}

// Exporta funções para uso global (opcional)
window.aiChat = {
  open: openAiChat,
  close: closeAiChat,
  toggle: toggleAiChat,
  sendMessage: processUserQuestion
};

