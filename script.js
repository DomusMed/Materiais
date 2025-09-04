// ============================
// Script da Capa
// ============================
const img = document.getElementById("capa");
if(img) img.src = img.src + "?t=" + new Date().getTime();

// ============================
// Script do Sumário
// ============================
const headers = document.querySelectorAll("h1, h2, h3");
const lista = document.getElementById("lista-sumario");

if(lista){
  headers.forEach((header, index) => {
    if (!header.id) header.id = "titulo-" + index;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + header.id;
    a.textContent = header.textContent;

    if (header.tagName === "H1") li.style.marginLeft = "20px";
    if (header.tagName === "H2") li.style.marginLeft = "40px";
    if (header.tagName === "H3") li.style.marginLeft = "60px";

    li.appendChild(a);
    lista.appendChild(li);
  });
}

// ============================
// Toggle da Sidebar
// ============================
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

if(toggleBtn && sidebar){
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    document.body.classList.toggle("sidebar-open");
  });
}

// ============================
// Barra de Progresso
// ============================
const progressBar = document.getElementById('progress-bar');
const readingTimeEl = document.getElementById('reading-time');
const WPM = 150;

function updateProgress() {
  if(!progressBar || !readingTimeEl) return;

  const words = document.body.innerText.trim().split(/\s+/).length;
  const totalMinutes = words / WPM;

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  const percent = Math.min(100, Math.round(progress));

  const containerWidth = document.getElementById("progress-container").offsetWidth;
  const readingTimeWidth = readingTimeEl.offsetWidth;
  const barWidth = (containerWidth - readingTimeWidth) * (percent / 100);

  progressBar.style.width = barWidth + "px";
  progressBar.textContent = percent + "%";

  progressBar.style.backgroundColor = percent === 100 ? "#4caf50" : "#5a9bd3";
  progressBar.style.color = percent === 100 ? "white" : "black";

  const minutesLeft = Math.max(0, Math.ceil(totalMinutes * (1 - percent / 100)));
  const hours = Math.floor(minutesLeft / 60);
  const mins = minutesLeft % 60;

  readingTimeEl.textContent = hours > 0 ? `Tempo restante estimado: ⏳ ${hours}h ${mins}m`
                                       : `Tempo restante estimado: ⏳ ${mins}m`;
}

window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
updateProgress();
