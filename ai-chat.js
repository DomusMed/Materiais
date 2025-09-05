/**
 * ============================
 * CHAT DE IA INTEGRADO COM TRANSFORMERS.JS
 * ============================
 * 
 * Este script implementa um chat interativo com IA que funciona 100% no navegador.
 * Utiliza Transformers.js para processamento local sem necessidade de backend.
 * 
 * Funcionalidades:
 * - Chat interativo com modelo de linguagem local
 * - Perguntas pré-definidas para interação rápida
 * - Seleção de texto para análise contextual
 * - Interface responsiva e acessível
 */

// ============================
// CONFIGURAÇÕES DA IA
// ============================

const AI_CONFIG = {
  MODEL_ID: 'Xenova/gpt2', // Modelo mais robusto para melhor qualidade
  MAX_LENGTH: 150,         // Comprimento máximo da resposta
  TEMPERATURE: 0.3,        // Menos criatividade para respostas mais focadas
  TOP_P: 0.8,             // Nucleus sampling mais conservador
  DO_SAMPLE: true,        // Ativa amostragem
  BATCH_SIZE: 1           // Tamanho do lote
};

// ============================
// VARIÁVEIS GLOBAIS
// ============================

let pipeline = null;
let isModelLoaded = false;
let isGenerating = false;
let selectedText = '';
let chatHistory = [];

// ============================
// CARREGAMENTO DO MODELO
// ============================

/**
 * Carrega o modelo de IA usando Transformers.js
 */
async function loadAIModel() {
  try {
    console.log('Iniciando carregamento do modelo de IA...');
    
    // Importa dinamicamente o Transformers.js
    const { pipeline: createPipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    
    // Carrega o pipeline de geração de texto
    pipeline = await createPipeline('text-generation', AI_CONFIG.MODEL_ID, {
      revision: 'main',
      cache_dir: './models/' // Cache local para melhor performance
    });
    
    isModelLoaded = true;
    console.log('Modelo de IA carregado com sucesso!');
    
    // Esconde indicador de carregamento e mostra chat
    showChatInterface();
    
    // Adiciona mensagem de boas-vindas
    addWelcomeMessage();
    
  } catch (error) {
    console.error('Erro ao carregar modelo de IA:', error);
    showErrorMessage('Erro ao carregar a IA. Tente recarregar a página.');
  }
}

/**
 * Mostra a interface do chat após carregar o modelo
 */
function showChatInterface() {
  const loadingIndicator = document.getElementById('ai-loading-indicator');
  const chatContent = document.getElementById('ai-chat-content');
  
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
  
  if (chatContent) {
    chatContent.classList.remove('hidden');
  }
}

/**
 * Adiciona mensagem de boas-vindas
 */
function addWelcomeMessage() {
  const welcomeMessage = `🎓 **Olá! Sou seu assistente de estudos médicos.**

🔹 **Como posso ajudar você hoje:**
• 🧸 **Explicações simples** - Para entender conceitos complexos
• 🔬 **Análises técnicas** - Detalhes em nível de doutorado  
• 📋 **Casos clínicos** - Prática de diagnóstico diferencial
• 📚 **Resumos** - Pontos high-yield para provas

🎯 **Para começar:**
1. **Selecione qualquer texto** na página - aparecerão botões de ação
2. **Use os botões rápidos** abaixo para perguntas comuns
3. **Digite sua própria pergunta** sobre o conteúdo

*Especializado em Síndrome Ictérica, bilirrubina e metabolismo hepático!*`;
  
  addMessageToChat('ai', welcomeMessage);
}

/**
 * Mostra mensagem de erro
 */
function showErrorMessage(message) {
  const loadingIndicator = document.getElementById('ai-loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.innerHTML = `
      <div style="color: #e74c3c; text-align: center;">
        <p>❌ ${message}</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar
        </button>
      </div>
    `;
  }
}

// ============================
// GERAÇÃO DE RESPOSTAS
// ============================

/**
 * Gera resposta da IA baseada no prompt
 */
async function generateAIResponse(prompt, context = '') {
  if (isGenerating) {
    throw new Error('A IA já está processando uma resposta. Aguarde...');
  }
  
  isGenerating = true;
  
  try {
    console.log('Processando pergunta:', prompt);
    
    // Primeiro tenta uma resposta contextual inteligente
    let response = generateContextualResponse(prompt, context);
    
    // Se não encontrou resposta contextual, usa o modelo de IA
    if (!response && isModelLoaded && pipeline) {
      response = await generateModelResponse(prompt, context);
    }
    
    // Se ainda não tem resposta, usa fallback educativo
    if (!response) {
      response = generateFallbackResponse(prompt, context);
    }
    
    console.log('Resposta gerada:', response);
    return response;
    
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    return generateFallbackResponse(prompt, context);
  } finally {
    isGenerating = false;
  }
}

/**
 * Gera resposta contextual baseada em padrões conhecidos
 */
function generateContextualResponse(prompt, context) {
  const promptLower = prompt.toLowerCase();
  const contextLower = context.toLowerCase();
  
  // Respostas para explicações infantis
  if (promptLower.includes('criança') || promptLower.includes('8 anos')) {
    if (contextLower.includes('crigler-najjar')) {
      return `🧸 **Explicação para crianças:**

Imagine que no seu corpo existe uma fábrica especial (o fígado) que limpa o sangue e tira as coisas ruins. 

A Síndrome de Crigler-Najjar acontece quando um trabalhador muito importante dessa fábrica (uma enzima) não funciona direito. É como se fosse um funcionário que deveria pintar as coisas de amarelo para tirá-las do corpo, mas ele está doente.

Quando isso acontece, o amarelo (bilirrubina) fica acumulado no corpo, deixando a pele e os olhos amarelados. É uma condição muito rara que a criança nasce com ela - como ter olhos azuis ou cabelo loiro.

Os médicos podem ajudar com tratamentos especiais para que a criança se sinta melhor! 💛`;
    }
    
    if (contextLower.includes('gilbert')) {
      return `🧸 **Explicação para crianças:**

A Síndrome de Gilbert é como ter um funcionário "preguiçoso" na fábrica do corpo (fígado). 

Esse funcionário deveria limpar uma tinta amarela (bilirrubina) do sangue, mas às vezes ele trabalha devagar. É como quando você está cansado e faz as tarefas mais lentamente.

Isso deixa a pessoa um pouquinho amarelada às vezes, especialmente quando está cansada, com fome ou estressada. Mas não é perigoso - é como ter sardas ou ser mais alto que os amigos!

Na verdade, essa "preguiça" especial até protege o corpo de algumas doenças. É uma característica especial que muitas pessoas têm! 😊`;
    }
    
    if (contextLower.includes('icterícia') || contextLower.includes('bilirrubina')) {
      return `🧸 **Explicação para crianças:**

A icterícia é quando a pele e os olhos ficam amarelados, como se a pessoa tivesse comido muito cenoura! 

Isso acontece porque existe uma tinta amarela (bilirrubina) no nosso corpo que vem dos glóbulos vermelhos velhinhos. É como quando você quebra um lápis amarelo e o pó fica na sua mão.

Normalmente, o fígado (que é como uma fábrica de limpeza) remove essa tinta amarela. Mas às vezes a fábrica fica sobrecarregada ou tem algum problema, e a tinta se acumula.

É importante ir ao médico para descobrir por que isso está acontecendo e como ajudar a fábrica a funcionar melhor! 🏭💛`;
    }
  }
  
  // Respostas para nível doutorado
  if (promptLower.includes('doutorado') || promptLower.includes('técnica') || promptLower.includes('detalhada')) {
    if (contextLower.includes('crigler-najjar')) {
      return `🔬 **Análise Técnica - Nível Doutorado:**

**Fisiopatologia Molecular:**
A Síndrome de Crigler-Najjar resulta de mutações no gene UGT1A1 (cromossoma 2q37), que codifica a UDP-glicuroniltransferase 1A1. Esta enzima catalisa a conjugação da bilirrubina não conjugada com ácido glicurônico.

**Classificação Molecular:**
- **Tipo I:** Deficiência completa da UGT1A1 (mutações nonsense/frameshift)
- **Tipo II:** Deficiência parcial (mutações missense com atividade residual <10%)

**Correlação Genótipo-Fenótipo:**
- Tipo I: Bilirrubina >20 mg/dL, kernicterus inevitável sem intervenção
- Tipo II: Bilirrubina 6-20 mg/dL, responsivo ao fenobarbital

**Implicações Terapêuticas:**
- Fenobarbital induz CYP2A6 e UGT1A1 residual
- Fototerapia converte bilirrubina em fotoisômeros solúveis
- Transplante hepático restaura capacidade conjugativa

**Prognóstico:** Dependente da prevenção de encefalopatia bilirrubínica durante desenvolvimento neurológico.`;
    }
  }
  
  // Respostas para casos clínicos
  if (promptLower.includes('caso clínico') || promptLower.includes('diagnóstico diferencial')) {
    if (contextLower.includes('crigler-najjar') || contextLower.includes('gilbert')) {
      return `📋 **Caso Clínico:**

**Apresentação:**
Paciente masculino, 25 anos, apresenta icterícia intermitente desde a adolescência, mais evidente durante jejum prolongado e episódios de estresse. Nega dor abdominal, colúria ou acolia fecal.

**Exame Físico:**
- Icterícia leve de escleras
- Abdome sem hepatoesplenomegalia
- Demais sistemas normais

**Laboratório:**
- Bilirrubina total: 3.2 mg/dL (VR: <1.2)
- Bilirrubina indireta: 2.8 mg/dL
- Bilirrubina direta: 0.4 mg/dL
- TGO/TGP: normais
- Hemograma: normal

**Diagnóstico Diferencial:**
1. Síndrome de Gilbert ⭐
2. Hemólise subclínica
3. Síndrome de Crigler-Najjar tipo II
4. Hepatopatia subclínica

**Pontos High-Yield:**
- Jejum prolongado exacerba Gilbert
- Reticulócitos normais excluem hemólise
- Fenobarbital melhora Gilbert e CN-II
- Gilbert: prevalência 7-9% população`;
    }
  }
  
  return null; // Não encontrou resposta contextual
}

/**
 * Gera resposta usando modelo de IA
 */
async function generateModelResponse(prompt, context) {
  try {
    const fullPrompt = preparePrompt(prompt, context);
    
    const result = await pipeline(fullPrompt, {
      max_length: AI_CONFIG.MAX_LENGTH,
      temperature: AI_CONFIG.TEMPERATURE,
      top_p: AI_CONFIG.TOP_P,
      do_sample: AI_CONFIG.DO_SAMPLE,
      num_return_sequences: 1,
      pad_token_id: pipeline.tokenizer.eos_token_id
    });
    
    let response = result[0].generated_text;
    response = response.replace(fullPrompt, '').trim();
    return postProcessResponse(response);
    
  } catch (error) {
    console.error('Erro no modelo de IA:', error);
    return null;
  }
}

/**
 * Gera resposta fallback educativa
 */
function generateFallbackResponse(prompt, context) {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('criança') || promptLower.includes('simples')) {
    return `🧸 Entendi que você quer uma explicação simples! 

A icterícia (ficar amarelado) acontece quando uma substância amarela chamada bilirrubina se acumula no corpo. É como quando você mistura tinta amarela na água - ela fica toda amarelada!

Isso pode acontecer por vários motivos, mas o importante é que os médicos sabem como investigar e tratar. 

Gostaria que eu explique alguma parte específica de forma mais detalhada? 😊`;
  }
  
  if (promptLower.includes('doutorado') || promptLower.includes('técnic')) {
    return `🔬 Para uma análise técnica detalhada:

A síndrome ictérica envolve o metabolismo da bilirrubina, desde sua formação pela degradação do heme até sua excreção biliar. Os distúrbios podem ser classificados em:

1. **Pré-hepáticos:** Hemólise excessiva
2. **Hepáticos:** Disfunção hepatocelular ou defeitos enzimáticos
3. **Pós-hepáticos:** Obstrução biliar

O diagnóstico diferencial baseia-se na proporção bilirrubina direta/indireta e no padrão das enzimas hepáticas.

Precisa de detalhes sobre algum aspecto específico da fisiopatologia?`;
  }
  
  if (promptLower.includes('caso clínico')) {
    return `📋 Aqui está um caso clínico relevante:

**Cenário:** Paciente com icterícia intermitente, sem sintomas sistêmicos, com predomínio de bilirrubina indireta.

**Pontos-chave para investigação:**
- História familiar de icterícia
- Fatores precipitantes (jejum, estresse)
- Ausência de hepatomegalia
- Enzimas hepáticas normais

**Principais hipóteses diagnósticas:**
1. Síndrome de Gilbert
2. Hemólise subclínica
3. Síndrome de Crigler-Najjar

Gostaria que eu elabore algum aspecto específico do caso?`;
  }
  
  return `💡 Entendi sua pergunta sobre o conteúdo médico! 

Posso ajudá-lo de várias formas:
- **Explicações simples** para conceitos complexos
- **Análises técnicas** detalhadas  
- **Casos clínicos** para prática
- **Resumos** dos pontos principais

Como posso explicar melhor o tópico que você selecionou? Você pode:
1. Usar os botões de pergunta rápida
2. Fazer uma pergunta específica
3. Selecionar outro texto da página

O que seria mais útil para seu estudo? 📚`;
}

/**
 * Prepara o prompt com contexto médico
 */
function preparePrompt(userPrompt, context = '') {
  const medicalContext = `
Como um assistente médico educacional especializado em explicar conceitos de medicina de forma clara e precisa:

Contexto médico atual: ${context || 'Síndrome Ictérica - estudo sobre bilirrubina e icterícia'}

Pergunta do estudante: ${userPrompt}

Resposta educativa:`;

  return medicalContext;
}

/**
 * Pós-processa a resposta para melhorar qualidade
 */
function postProcessResponse(response) {
  if (!response || response.length < 10) {
    return 'Desculpe, não consegui gerar uma resposta adequada. Pode reformular sua pergunta?';
  }
  
  // Remove quebras de linha excessivas
  response = response.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Remove caracteres especiais problemáticos
  response = response.replace(/[^\w\s\.,;:!?\-\(\)\[\]"'áéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ]/g, '');
  
  // Limita a resposta se muito longa
  if (response.length > 500) {
    response = response.substring(0, 500) + '...';
  }
  
  // Adiciona pontualização se necessário
  if (!response.match(/[.!?]$/)) {
    response += '.';
  }
  
  return response.trim();
}

// ============================
// INTERFACE DO CHAT
// ============================

/**
 * Adiciona mensagem ao chat
 */
function addMessageToChat(sender, message, isTyping = false) {
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  if (isTyping && sender === 'ai') {
    messageDiv.classList.add('typing');
    messageDiv.innerHTML = `
      <span>Pensando</span>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
  } else {
    messageDiv.textContent = message;
  }
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return messageDiv;
}

/**
 * Remove mensagem do chat
 */
function removeMessageFromChat(messageElement) {
  if (messageElement && messageElement.parentNode) {
    messageElement.parentNode.removeChild(messageElement);
  }
}

/**
 * Processa envio de mensagem
 */
async function sendMessage(message, context = '') {
  if (!message.trim()) return;
  
  // Adiciona mensagem do usuário
  addMessageToChat('user', message);
  
  // Adiciona indicador de digitação
  const typingMessage = addMessageToChat('ai', '', true);
  
  // Desabilita botões durante processamento
  toggleChatControls(false);
  
  try {
    // Gera resposta
    const response = await generateAIResponse(message, context);
    
    // Remove indicador de digitação
    removeMessageFromChat(typingMessage);
    
    // Adiciona resposta da IA
    addMessageToChat('ai', response);
    
    // Salva no histórico
    chatHistory.push({ user: message, ai: response, context: context });
    
  } catch (error) {
    // Remove indicador de digitação
    removeMessageFromChat(typingMessage);
    
    // Mostra mensagem de erro
    const errorMessage = error.message || 'Erro ao processar sua mensagem. Tente novamente.';
    addMessageToChat('ai', `❌ ${errorMessage}`);
    
    console.error('Erro no chat:', error);
  } finally {
    // Reabilita controles
    toggleChatControls(true);
  }
}

/**
 * Habilita/desabilita controles do chat
 */
function toggleChatControls(enabled) {
  const sendButton = document.getElementById('ai-chat-send');
  const inputField = document.getElementById('ai-chat-input');
  const quickButtons = document.querySelectorAll('.ai-quick-btn');
  
  if (sendButton) {
    sendButton.disabled = !enabled;
  }
  
  if (inputField) {
    inputField.disabled = !enabled;
  }
  
  quickButtons.forEach(btn => {
    btn.disabled = !enabled;
  });
}

// ============================
// PERGUNTAS PRÉ-DEFINIDAS
// ============================

/**
 * Define templates de perguntas baseadas no tipo
 */
function getQuestionTemplate(type, selectedText = '') {
  const templates = {
    'como-crianca': `Explique o seguinte conceito médico de forma muito simples, como se fosse para uma criança de 8 anos: "${selectedText}"`,
    'nivel-doutorado': `Forneça uma explicação detalhada e técnica em nível de doutorado sobre: "${selectedText}"`,
    'caso-clinico': `Crie um caso clínico interessante para diagnóstico diferencial envolvendo: "${selectedText}". Inclui: apresentação, exames e pontos chave.`,
    'resumir': `Resuma os pontos mais importantes e high-yield facts sobre: "${selectedText}"`
  };
  
  return templates[type] || `Explique mais sobre: "${selectedText}"`;
}

/**
 * Processa pergunta rápida
 */
async function handleQuickQuestion(questionType) {
  const context = selectedText || 'conteúdo da página sobre síndrome ictérica';
  const question = getQuestionTemplate(questionType, context);
  
  await sendMessage(question, context);
}

// ============================
// SELEÇÃO DE TEXTO
// ============================

/**
 * Obtém texto selecionado
 */
function getSelectedText() {
  const selection = window.getSelection();
  return selection.toString().trim();
}

/**
 * Mostra popup de ações para texto selecionado
 */
function showTextSelectionPopup(x, y, text) {
  const popup = document.getElementById('text-selection-popup');
  if (!popup || !text) return;
  
  selectedText = text;
  
  // Posiciona popup
  popup.style.left = x + 'px';
  popup.style.top = (y - 10) + 'px';
  popup.classList.remove('hidden');
  
  // Remove popup após 5 segundos
  setTimeout(() => {
    hideTextSelectionPopup();
  }, 5000);
}

/**
 * Esconde popup de seleção
 */
function hideTextSelectionPopup() {
  const popup = document.getElementById('text-selection-popup');
  if (popup) {
    popup.classList.add('hidden');
  }
}

/**
 * Processa ação de seleção de texto
 */
async function handleTextSelection(action) {
  hideTextSelectionPopup();
  
  if (!selectedText) return;
  
  // Abre chat se não estiver visível
  const chatWindow = document.getElementById('ai-chat-window');
  if (chatWindow && chatWindow.classList.contains('hidden')) {
    toggleChat();
  }
  
  // Mapeia ações para tipos de pergunta
  const actionMap = {
    'explain-child': 'como-crianca',
    'explain-phd': 'nivel-doutorado',
    'create-case': 'caso-clinico'
  };
  
  const questionType = actionMap[action];
  if (questionType) {
    await handleQuickQuestion(questionType);
  }
}

// ============================
// CONTROLE DA JANELA DE CHAT
// ============================

/**
 * Alterna visibilidade do chat
 */
function toggleChat() {
  const chatWindow = document.getElementById('ai-chat-window');
  if (!chatWindow) return;
  
  const isHidden = chatWindow.classList.contains('hidden');
  
  if (isHidden) {
    chatWindow.classList.remove('hidden');
    
    // Carrega modelo se necessário
    if (!isModelLoaded && !pipeline) {
      loadAIModel();
    }
  } else {
    chatWindow.classList.add('hidden');
  }
}

/**
 * Fecha o chat
 */
function closeChat() {
  const chatWindow = document.getElementById('ai-chat-window');
  if (chatWindow) {
    chatWindow.classList.add('hidden');
  }
}

// ============================
// EVENT LISTENERS
// ============================

/**
 * Configura todos os event listeners do chat
 */
function setupChatEventListeners() {
  // Botão de abrir chat
  const chatIcon = document.getElementById('ai-chat-icon');
  if (chatIcon) {
    chatIcon.addEventListener('click', toggleChat);
  }
  
  // Botão de fechar chat
  const closeButton = document.getElementById('ai-chat-close');
  if (closeButton) {
    closeButton.addEventListener('click', closeChat);
  }
  
  // Botão de enviar mensagem
  const sendButton = document.getElementById('ai-chat-send');
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      const input = document.getElementById('ai-chat-input');
      if (input && input.value.trim()) {
        sendMessage(input.value.trim());
        input.value = '';
      }
    });
  }
  
  // Campo de input (Enter para enviar)
  const inputField = document.getElementById('ai-chat-input');
  if (inputField) {
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const sendButton = document.getElementById('ai-chat-send');
        if (sendButton && !sendButton.disabled) {
          sendButton.click();
        }
      }
    });
    
    // Auto-resize do textarea
    inputField.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    });
  }
  
  // Botões de perguntas rápidas
  const quickButtons = document.querySelectorAll('.ai-quick-btn');
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const questionType = btn.getAttribute('data-question');
      if (questionType) {
        handleQuickQuestion(questionType);
      }
    });
  });
  
  // Botões de ação para texto selecionado
  const selectionButtons = document.querySelectorAll('.selection-btn');
  selectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action) {
        handleTextSelection(action);
      }
    });
  });
  
  // Seleção de texto
  document.addEventListener('mouseup', (e) => {
    setTimeout(() => {
      const text = getSelectedText();
      if (text && text.length > 10) {
        showTextSelectionPopup(e.pageX, e.pageY, text);
      } else {
        hideTextSelectionPopup();
      }
    }, 100);
  });
  
  // Clique fora do popup fecha ele
  document.addEventListener('click', (e) => {
    const popup = document.getElementById('text-selection-popup');
    if (popup && !popup.contains(e.target) && !popup.classList.contains('hidden')) {
      hideTextSelectionPopup();
    }
  });
  
  // ESC fecha chat e popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const chatWindow = document.getElementById('ai-chat-window');
      const popup = document.getElementById('text-selection-popup');
      
      if (popup && !popup.classList.contains('hidden')) {
        hideTextSelectionPopup();
      } else if (chatWindow && !chatWindow.classList.contains('hidden')) {
        closeChat();
      }
    }
  });
  
  console.log('Event listeners do chat configurados');
}

// ============================
// INICIALIZAÇÃO
// ============================

/**
 * Inicializa o sistema de chat
 */
function initializeAIChat() {
  console.log('Inicializando chat de IA...');
  
  try {
    setupChatEventListeners();
    console.log('Chat de IA inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar chat de IA:', error);
  }
}

// ============================
// AUTO-INICIALIZAÇÃO
// ============================

// Inicializa quando o DOM estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAIChat);
} else {
  initializeAIChat();
}

// Exporta funções para uso global se necessário
window.AIChat = {
  loadModel: loadAIModel,
  sendMessage: sendMessage,
  toggleChat: toggleChat,
  closeChat: closeChat
};
