  <!-- ============================
       Script da Capa
       ============================ -->

  const img = document.getElementById("capa");
  img.src = img.src + "?t=" + new Date().getTime();

  <!-- ============================
       Script do Sumário
       ============================ -->

      const headers = document.querySelectorAll("h0, h1, h2");
  const lista = document.getElementById("lista-sumario");

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


  // Sidebar toggle
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    document.body.classList.toggle("sidebar-open");
  });

  <!-- ============================
       Barra de Progresso
       ============================ -->

  <div id="progress-container">
    <div id="reading-time"></div>
    <div id="progress-bar"></div>
  </div>

    const progressBar = document.getElementById('progress-bar');
    const readingTimeEl = document.getElementById('reading-time');
    const WPM = 150; // Palavras por minuto


    // Conta palavras
    const words = document.body.innerText.trim().split(/\s+/).length;
    const totalMinutes = words / WPM;


    function updateProgress() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      const percent = Math.min(100, Math.round(progress));

      // calcula largura real disponível
      const containerWidth = document.getElementById("progress-container").offsetWidth;
      const readingTimeWidth = readingTimeEl.offsetWidth;
      const barWidth = (containerWidth - readingTimeWidth) * (percent / 100);

      progressBar.style.width = barWidth + "px";
      progressBar.textContent = percent + "%";

      // Azul até 99%, verde em 100%
      progressBar.style.backgroundColor = percent === 100 ? "#4caf50" : "#5a9bd3";
      progressBar.style.color = percent === 100 ? "white" : "black";


     // Tempo restante em min/hora
      const minutesLeft = Math.max(0, Math.ceil(totalMinutes * (1 - percent / 100)));
      const hours = Math.floor(minutesLeft / 60);
      const mins = minutesLeft % 60;

      if (hours > 0) {
        readingTimeEl.textContent = `Tempo restante estimado: ⏳ ${hours}h ${mins}m`;
      } else {
        readingTimeEl.textContent = `Tempo restante estimado: ⏳ ${mins}m`;
      }
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
