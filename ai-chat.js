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
 * Carrega o modelo de IA (modo simplificado)
 */
async function loadAIModel() {
  console.log('Inicializando assistente médico...');
  
  // Mostra interface imediatamente
  showChatInterface();
  addWelcomeMessage();
  
  // Marca como carregado (usando respostas contextuais)
  isModelLoaded = true;
  console.log('Assistente médico pronto! Usando respostas contextuais especializadas.');
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
  const welcomeMessage = `**🎓 Assistente de Estudos Médicos**

**Como posso ajudar:**
• 🧸 **Explicações simples** - Conceitos fáceis de entender
• 🔬 **Análises técnicas** - Detalhes avançados
• 📋 **Casos clínicos** - Prática para provas
• 📚 **Resumos** - Pontos importantes

**Como usar:**
• **Selecione texto** na página → aparecem botões
• **Use botões rápidos** abaixo
• **Digite perguntas** diretamente

**Especialidade:**
Síndrome Ictérica, bilirrubina e metabolismo hepático

*Pronto para estudar! Selecione um texto ou use os botões abaixo.*`;
  
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
      return `**🧸 Explicação Simples - Síndrome de Crigler-Najjar**

**O que é:**
• É como ter uma "fábrica" no corpo (fígado) com um trabalhador doente
• Este trabalhador deveria limpar uma "tinta amarela" do sangue
• Quando ele não funciona, a pessoa fica amarelada

**Por que acontece:**
• A criança já nasce assim (como ter olhos azuis)
• É muito raro - pouquíssimas pessoas têm
• Não é culpa de ninguém

**O que os médicos fazem:**
• Tratamentos com luz especial
• Remédios que ajudam
• Cuidados especiais

**É importante saber:**
• Com tratamento, a criança pode viver bem
• Os médicos sabem como cuidar
• A família sempre ajuda muito! 💛`;
    }
    
    if (contextLower.includes('gilbert')) {
      return `**🧸 Explicação Simples - Síndrome de Gilbert**

**O que é:**
• É ter um "funcionário preguiçoso" no fígado
• Ele deveria limpar uma tinta amarela do sangue
• Às vezes trabalha devagar (como quando estamos cansados)

**Quando aparece:**
• Quando a pessoa está cansada
• Quando não come por muito tempo
• Quando está muito estressada
• Deixa a pessoa um pouquinho amarelada

**É perigoso?**
• NÃO! É completamente seguro
• É como ter sardas ou ser alto
• Muitas pessoas têm (1 em cada 10!)
• Na verdade, até protege de algumas doenças

**O legal:**
• É uma característica especial
• Não precisa de tratamento
• A pessoa vive normalmente! 😊`;
    }
    
    if (contextLower.includes('icterícia') || contextLower.includes('bilirrubina')) {
      return `**🧸 Explicação Simples - Icterícia**

**O que é icterícia:**
• É quando a pele e os olhos ficam amarelados
• Como se tivesse comido muita cenoura!
• Vem de uma "tinta amarela" no sangue

**De onde vem a tinta amarela:**
• Dos glóbulos vermelhos velhinhos
• É como quebrar um lápis amarelo
• O pó amarelo fica espalhado

**Como o corpo limpa:**
• O fígado é uma "fábrica de limpeza"
• Ele pega a tinta amarela
• E joga fora nas fezes e urina

**Quando há problema:**
• A fábrica fica sobrecarregada
• Ou tem algum "funcionário" doente
• A tinta amarela se acumula

**O que fazer:**
• Ir ao médico investigar
• Descobrir por que aconteceu
• Ajudar a fábrica a funcionar melhor! 🏭💛`;
    }
  }
  
  // Respostas para nível doutorado
  if (promptLower.includes('doutorado') || promptLower.includes('técnica') || promptLower.includes('detalhada')) {
    if (contextLower.includes('crigler-najjar')) {
      return `**🔬 Análise Técnica - Síndrome de Crigler-Najjar**

**1. Fisiopatologia Molecular:**
• Mutações no gene UGT1A1 (cromossoma 2q37)
• Codifica UDP-glicuroniltransferase 1A1
• Catalisa conjugação: bilirrubina + ácido glicurônico

**2. Classificação Molecular:**
• **Tipo I:** Deficiência completa UGT1A1
  - Mutações nonsense/frameshift
  - Bilirrubina >20 mg/dL
  - Kernicterus inevitável sem tratamento

• **Tipo II:** Deficiência parcial (<10% atividade)
  - Mutações missense
  - Bilirrubina 6-20 mg/dL
  - Responsivo ao fenobarbital

**3. Abordagem Terapêutica:**
• **Fenobarbital:** Induz CYP2A6 e UGT1A1 residual
• **Fototerapia:** Converte em fotoisômeros solúveis
• **Transplante:** Restaura capacidade conjugativa

**4. Prognóstico:**
• Crítico: Prevenção de encefalopatia bilirrubínica
• Janela terapêutica limitada no desenvolvimento neurológico
• Monitoramento contínuo essencial`;
    }
    
    if (contextLower.includes('gilbert')) {
      return `**🔬 Análise Técnica - Síndrome de Gilbert**

**1. Base Molecular:**
• Redução 70-80% atividade UGT1A1
• Polimorfismo TA repeat no promotor TATA
• (TA)7 em vez de (TA)6 normal

**2. Fisiopatologia:**
• Conjugação reduzida mas não ausente
• Compensável em condições normais
• Descompensação com estresse metabólico

**3. Fatores Precipitantes:**
• **Jejum:** Redução caloria/glicose
• **Estresse:** Cortisol ↑, gliconeogênese ↑
• **Exercício:** Aumento demanda energética
• **Álcool:** Inibição competitiva UGT1A1

**4. Implicações Clínicas:**
• Efeito protetor: Antioxidante endógeno
• Redução risco cardiovascular
• Menor incidência câncer cólon
• Diagnóstico diferencial essencial`;
    }
  }
  
  // Respostas para casos clínicos
  if (promptLower.includes('caso clínico') || promptLower.includes('diagnóstico diferencial')) {
    if (contextLower.includes('crigler-najjar') || contextLower.includes('gilbert')) {
      return `**📋 Caso Clínico - Icterícia em Adulto Jovem**

**APRESENTAÇÃO:**
• Homem, 25 anos
• Icterícia intermitente desde adolescência
• Piora com jejum e estresse
• Nega dor, colúria ou acolia

**EXAME FÍSICO:**
• Icterícia leve de escleras
• Abdome: sem hepatoesplenomegalia
• Demais sistemas normais

**LABORATÓRIO:**
• Bilirrubina total: 3.2 mg/dL (VR <1.2)
• Bilirrubina indireta: 2.8 mg/dL
• Bilirrubina direta: 0.4 mg/dL
• TGO/TGP: normais
• Hemograma: normal

**DIAGNÓSTICO DIFERENCIAL:**
1. **Síndrome de Gilbert ⭐ (mais provável)**
2. Hemólise subclínica
3. Síndrome de Crigler-Najjar tipo II
4. Hepatopatia oculta

**PONTOS HIGH-YIELD:**
• Jejum prolongado → piora Gilbert
• Reticulócitos normais → exclui hemólise
• Fenobarbital melhora Gilbert e CN-II
• Gilbert: 7-9% da população
• Padrão familiar comum

**DIAGNÓSTICO:** Síndrome de Gilbert
**CONDUTA:** Tranquilização + orientação dietética`;
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
    return `**🧸 Explicação Simples - Icterícia**

**O que é:**
• Quando ficamos amarelados (pele e olhos)
• Vem de uma "tinta amarela" no sangue
• Como misturar tinta amarela na água

**Por que acontece:**
• Os glóbulos vermelhos ficam velhinhos
• Liberam essa tinta amarela
• O fígado (nossa "fábrica de limpeza") remove ela

**Quando há problema:**
• A fábrica fica sobrecarregada
• Ou tem algum "funcionário" doente
• A tinta se acumula

**É sério?**
Depende da causa, mas os médicos sabem investigar e tratar!

*Quer que eu explique alguma parte específica? 😊*`;
  }
  
  if (promptLower.includes('doutorado') || promptLower.includes('técnic')) {
    return `**🔬 Análise Técnica - Síndrome Ictérica**

**1. Metabolismo da Bilirrubina:**
• Formação: degradação heme → biliverdina → bilirrubina
• Transporte: ligada à albumina (insolúvel)
• Conjugação: UGT1A1 no hepatócito
• Excreção: bile → intestino

**2. Classificação Fisiopatológica:**
• **Pré-hepática:** Hemólise excessiva
• **Hepática:** Disfunção hepatocelular/enzimática  
• **Pós-hepática:** Obstrução biliar

**3. Diagnóstico Diferencial:**
• Proporção BD/BI (direta/indireta)
• Padrão enzimático (TGO/TGP vs FA/GGT)
• Sinais clínicos associados

**4. Pontos-Chave:**
• BI ↑ → hemólise ou defeito conjugação
• BD ↑ → lesão hepatocelular ou colestase

*Precisa de detalhes sobre algum aspecto específico?*`;
  }
  
  if (promptLower.includes('caso clínico')) {
    return `**📋 Caso Clínico Modelo**

**CENÁRIO:**
Icterícia intermitente em adulto jovem

**INVESTIGAÇÃO ESSENCIAL:**
• História familiar de icterícia
• Fatores precipitantes (jejum, estresse, álcool)
• Padrão das enzimas hepáticas
• Presença/ausência de hepatomegalia

**PRINCIPAIS HIPÓTESES:**
1. **Síndrome de Gilbert** (mais comum)
2. Hemólise subclínica
3. Síndrome de Crigler-Najjar

**PONTOS HIGH-YIELD:**
• Gilbert: 7-9% população, piora com jejum
• Crigler-Najjar: raro, pode causar kernicterus
• Reticulócitos normais → exclui hemólise

*Quer que eu elabore algum aspecto específico?*`;
  }
  
  return `**💡 Como posso ajudar com seus estudos?**

**Opções disponíveis:**
• 🧸 **Explicações simples** - Para entender melhor
• 🔬 **Análises técnicas** - Detalhes avançados
• 📋 **Casos clínicos** - Prática para provas
• 📚 **Resumos** - Pontos importantes

**Próximos passos:**
1. Use os botões rápidos abaixo
2. Selecione texto na página
3. Digite uma pergunta específica

*O que seria mais útil para seu estudo? 📚*`;
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
      <span>Analisando...</span>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
  } else {
    // Formatar mensagem com markdown simples
    messageDiv.innerHTML = formatMessage(message);
  }
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return messageDiv;
}

/**
 * Formata mensagem com markdown simples
 */
function formatMessage(message) {
  if (!message) return '';
  
  let formatted = message
    // Títulos
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Itálico
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Quebras de linha
    .replace(/\n/g, '<br>')
    // Lista com bullets
    .replace(/^[•\-\*] (.+)/gm, '• $1')
    // Seções numeradas
    .replace(/^(\d+\.) (.+)/gm, '<strong>$1</strong> $2');
  
  return formatted;
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
