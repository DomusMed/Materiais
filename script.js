// Lógica para o menu hamburger em telas menores
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Fecha o menu ao clicar em um link
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Futuras funcionalidades podem ser adicionadas aqui:
// 1. Lógica para carregar resumos dinamicamente na página resumos.html
// 2. Validação de formulários (login, cadastro, comentários)
// 3. Interação com o backend para salvar favoritos, enviar avaliações, etc.
