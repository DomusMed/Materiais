/**
 * ==================================================
 * SCRIPT DO ASSISTENTE IA MODULAR
 * ==================================================
 * 
 * Este script gerencia a funcionalidade do botão flutuante e do modal do Assistente IA.
 * - Controle de exibição do modal.
 * - Captura de texto selecionado na página.
 * - Geração dinâmica de perguntas pré-formuladas.
 * - Lógica para alternar entre plataformas (ChatGPT e OpenEvidence).
 * - Envio de perguntas personalizadas.
 * - Responsividade e acessibilidade.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // CONFIGURAÇÕES E CONSTANTES
    // ============================

    const PREDEFINED_QUESTIONS = [
        { short: "Explique de forma simples para uma criança de 10 anos", detailed: "Explique este conteúdo médico como se estivesse ensinando a uma criança de 10 anos, usando analogias simples, mantendo os conceitos corretos, de forma extremamente clara e didática. Foque na compreensão básica sem jargão técnico." },
        { short: "Resuma em um parágrafo (nível doutorado)", detailed: "Explique este conteúdo médico em um único parágrafo como resumo de aula de doutorado. Inclua pontos essenciais de fisiopatologia, epidemiologia, manifestações clínicas, diagnóstico diferencial, exames relevantes, tratamento ou prognóstico. Ressalte aspectos práticos e correlações anatômicas ou clínicas importantes." },
        { short: "Explique o conteúdo completo (nível doutorado)", detailed: "Explique este conteúdo médico detalhadamente, como em uma aula de doutorado. Inclua fisiopatologia, epidemiologia, manifestações clínicas, diagnóstico diferencial, exames laboratoriais e de imagem, tratamento, prognóstico e condutas práticas. Faça correlações anatômicas, fisiológicas ou clínicas quando relevante, priorizando informações práticas e objetivas." },
        { short: "Crie um caso clínico real baseado neste conteúdo", detailed: "Com base neste conteúdo médico, crie um caso clínico realista, incluindo história clínica, exame físico e resultados laboratoriais/exames de imagem relevantes. Destaque pontos importantes para tomada de decisão, diagnóstico e manejo, de forma educativa, sem fornecer respostas prontas." },
        { short: "Faça um resumo objetivo para estudo prático", detailed: "Faça um resumo conciso do conteúdo médico
