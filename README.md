<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sumário Repositório DomusMed</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #0A4C6A;
            --secondary-color: #E09F3E;
            --accent-color: #0891B2;
            --text-dark: #1E293B;
            --text-light: #64748B;
            --bg-light: #F8FAFC;
            --white: #FFFFFF;
            --border-color: #E2E8F0;
            --hover-bg: #F1F5F9;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background: linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%);
            min-height: 100vh;
        }

        /* Header Fixo */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--white);
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            z-index: 1000;
            padding: 1rem 2rem;
        }

        .logo {
            height: 50px;
            width: auto;
        }

        /* Hero Section */
        .hero {
            margin-top: 82px;
            padding: 4rem 2rem 3rem;
            text-align: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            color: var(--white);
        }

        .hero h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0;
        }

        /* Nova Seção de Introdução */
        .intro-section {
            background: var(--white);
            padding: 3rem 2rem;
            max-width: 900px;
            margin: -40px auto 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            position: relative;
            z-index: 10;
        }

        .intro-content {
            text-align: center;
        }

        .intro-content p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--text-dark);
            margin-bottom: 1.3rem;
        }

        .intro-content p:last-child {
            margin-bottom: 0;
        }

        .intro-highlight {
            color: var(--primary-color);
            font-weight: 700;
            position: relative;
            display: inline-block;
        }

        .intro-highlight::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--secondary-color) 0%, transparent 100%);
            border-radius: 2px;
        }

        .intro-divider {
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, var(--secondary-color) 0%, var(--accent-color) 100%);
            margin: 2rem auto;
            border-radius: 2px;
        }

        .intro-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: block;
        }

        /* Filtros */
        .filters-section {
            padding: 2rem;
            background: var(--white);
            max-width: 1400px;
            margin: 0 auto 3rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            position: relative;
        }

        .filters-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            justify-content: center;
        }

        .filter-btn {
            padding: 0.7rem 1.5rem;
            border: 2px solid var(--border-color);
            background: var(--white);
            color: var(--text-dark);
            border-radius: 50px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .filter-btn:hover {
            border-color: var(--accent-color);
            background: var(--hover-bg);
            transform: translateY(-2px);
        }

        .filter-btn.active {
            background: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }

        /* Container Principal */
        .main-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem 4rem;
        }

        /* Seção de Especialidade */
        .specialty-section {
            margin-bottom: 3rem;
            animation: fadeIn 0.5s ease;
        }

        .specialty-section.hidden {
            display: none;
        }

        .specialty-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.8rem;
            border-bottom: 3px solid var(--secondary-color);
        }

        .specialty-icon {
            font-size: 2rem;
        }

        .specialty-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
        }

        .specialty-count {
            background: var(--secondary-color);
            color: var(--white);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        /* Grid de Resumos */
        .resumes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.2rem;
        }

        /* Card de Resumo */
        .resume-card {
            background: var(--white);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .resume-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--accent-color);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }

        .resume-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(10, 76, 106, 0.15);
            border-color: var(--accent-color);
        }

        .resume-card:hover::before {
            transform: scaleY(1);
        }

        .resume-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
        }

        .resume-card:hover .resume-title {
            color: var(--primary-color);
        }

        .resume-tag {
            display: inline-block;
            background: var(--bg-light);
            color: var(--text-light);
            padding: 0.3rem 0.8rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        /* Status Badge */
        .coming-soon {
            background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
            color: var(--white);
            padding: 0.4rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            display: inline-block;
        }

        /* Footer */
        .footer {
            background: var(--primary-color);
            color: var(--white);
            padding: 3rem 2rem 2rem;
            text-align: center;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-logo {
            height: 60px;
            margin-bottom: 1.5rem;
            filter: brightness(0) invert(1);
        }

        .footer p {
            margin-bottom: 1rem;
            opacity: 0.9;
        }

        .contact-info {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin: 1.5rem 0;
            font-size: 1.1rem;
        }

        .contact-info a {
            color: var(--secondary-color);
            text-decoration: none;
            font-weight: 600;
        }

        .footer-divider {
            height: 1px;
            background: rgba(255,255,255,0.2);
            margin: 2rem 0 1rem;
        }

        .copyright {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        /* Animações */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsividade */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 1.8rem;
            }

            .intro-section {
                padding: 2rem 1.5rem;
                margin: -30px 1rem 2rem;
            }

            .intro-content p {
                font-size: 1rem;
            }

            .intro-icon {
                font-size: 2rem;
            }

            .filters-section {
                padding: 1.5rem;
            }

            .filter-btn {
                font-size: 0.85rem;
                padding: 0.6rem 1.2rem;
            }

            .resumes-grid {
                grid-template-columns: 1fr;
            }

            .specialty-title {
                font-size: 1.5rem;
            }
        }

            /* Scroll Suave */
            html {
                scroll-behavior: smooth;
            }
            .resume-card {
                text-decoration: none;
                       color: inherit;
                display: block;
            }
        
            .resume-card:hover {
                text-decoration: none;
            }

            /* Estilo para links nos cards */
            a.resume-card {
                text-decoration: none;
                color: inherit;
                display: block;
            }

            a.resume-card:visited {
                color: inherit;
            }
        
            a.resume-card:hover {
                text-decoration: none;
            }
    </style>

</head>
<body>

    <!-- Header Fixo -->
    <header class="header">
        <img src="https://lh3.googleusercontent.com/d/1CAV1xbDtXy5Pz_lI0dHocMbVNcEJDUyu" alt="DomusMed Logo" class="logo">
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Sumário - Repositório DomusMed</h1><br>
    </section>

    <!-- Nova Seção de Introdução -->
    <section class="intro-section">
        <div class="intro-content">

            <p>Acesse os resumos DomusMed de forma <span class="intro-highlight">100% gratuita</span> e sem necessidade de cadastro.</p>

            <p>Estude de forma <span class="intro-highlight">direcionada e inteligente</span> para o que mais importa sobre cada conteúdo.</p>

            <p>Basta clicar, acessar e usufruir das ferramentas gratuitas que vão diminuir o seu esforço nos estudos e direcionar o tempo para o que realmente importa: <span class="intro-highlight">leitura, compreensão, assimilação e retenção de conteúdo</span>.</p>
        </div>
    </section>

    <!-- Filtros -->
    <section class="filters-section">
        <div class="filters-container">
            <button class="filter-btn active" data-filter="all">Todas as Especialidades</button>
            <button class="filter-btn" data-filter="cardiologia">Cardiologia</button>
            <button class="filter-btn" data-filter="endocrinologia">Endocrinologia</button>
            <button class="filter-btn" data-filter="gastroenterologia">Gastroenterologia</button>
            <button class="filter-btn" data-filter="hematologia">Hematologia</button>
            <button class="filter-btn" data-filter="hepatologia">Hepatologia</button>
            <button class="filter-btn" data-filter="infectologia">Infectologia</button>
            <button class="filter-btn" data-filter="nefrologia">Nefrologia</button>
            <button class="filter-btn" data-filter="neurologia">Neurologia</button>
            <button class="filter-btn" data-filter="pneumologia">Pneumologia</button>
            <button class="filter-btn" data-filter="reumatologia">Reumatologia</button>
            <button class="filter-btn" data-filter="ginecologia">Ginecologia</button>
            <button class="filter-btn" data-filter="obstetricia">Obstetrícia</button>
            <button class="filter-btn" data-filter="cirurgia">Cirurgia</button>
            <button class="filter-btn" data-filter="pediatria">Pediatria</button>
            <button class="filter-btn" data-filter="preventiva">Medicina Preventiva</button>
        </div>
    </section>

    <!-- Container Principal -->
    <main class="main-container">

<!-- Cardiologia -->
<section class="specialty-section" data-specialty="cardiologia">
    <div class="specialty-header">
        <span class="specialty-icon">🫀</span>
        <h2 class="specialty-title">Cardiologia</h2>
        <span class="specialty-count">13 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/introducao-a-cardiologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Cardiologia</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/hipertensao-arterial-sistemica.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Hipertensão Arterial Sistêmica</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/sindrome-metabolica-e-dislipidemias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Síndrome Metabólica e Dislipidemias</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/doenca-arterial-coronariana.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doença Arterial Coronariana</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/insuficiencia-cardiaca.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Insuficiência Cardíaca</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/cardiomiopatias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Cardiomiopatias</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/valvopatias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Valvopatias</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/pericardiopatias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Pericardiopatias</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/bradiarritmias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Bradiarritmias</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/taquiarritmias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Taquiarritmias</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/marca-passo.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Marca-passo</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/sincope.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Síncope</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/cardiologia/parada-cardiorrespiratoria.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Parada Cardiorrespiratória</h3>
            <span class="resume-tag">Cardiologia</span>
        </a>
    </div>
</section>

<!-- Endocrinologia -->
<section class="specialty-section" data-specialty="endocrinologia">
    <div class="specialty-header">
        <span class="specialty-icon">🧪</span>
        <h2 class="specialty-title">Endocrinologia</h2>
        <span class="specialty-count">8 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/diabetes-melitus.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Diabetes Melitus</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/obesidade.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Obesidade</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/doencas-da-tireoide.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças da Tireoide</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/doencas-da-paratireoide.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças da Paratireoide</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/doencas-do-metabolismo-osseo.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Metabolismo Ósseo</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/doencas-da-hipofise.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças da Hipófise</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/doencas-da-adrenal.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças da Adrenal</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/endocrinologia/neoplasia-endocrina-multipla-(NEM).html" class="resume-card" target="_blank">
            <h3 class="resume-title">Neoplasia Endócrina Múltipla (NEM)</h3>
            <span class="resume-tag">Endocrinologia</span>
        </a>
    </div>
</section>

<!-- Gastroenterologia -->
<section class="specialty-section" data-specialty="gastroenterologia">
    <div class="specialty-header">
        <span class="specialty-icon">🍽️</span>
        <h2 class="specialty-title">Gastroenterologia</h2>
        <span class="specialty-count">10 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-esofago.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Esôfago</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-estomago.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Estômago</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-intestino-parte-1.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Intestino - Parte 1</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-intestino-parte-2.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Intestino - Parte 2</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-intestino-parte-3.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Intestino - Parte 3</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-intestino-parte-4.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Intestino - Parte 4</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-intestino-parte-5.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Intestino - Parte 5</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-do-pancreas.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças do Pâncreas</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/doencas-das-vias-biliares.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças das Vias Biliares</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/gastroenterologia/hemorragia-digestiva.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Hemorragia Digestiva</h3>
            <span class="resume-tag">Gastroenterologia</span>
        </a>
    </div>
</section>

<!-- Hematologia -->
<section class="specialty-section" data-specialty="hematologia">
    <div class="specialty-header">
        <span class="specialty-icon">🩸</span>
        <h2 class="specialty-title">Hematologia</h2>
        <span class="specialty-count">14 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/introducao-a-hematologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Hematologia</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/anemias-hipoproliferativas.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Anemias Hipoproliferativas</h3>
            <span class="resume-tag">Hematologia
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/anemias-hiperproliferativas.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Anemias Hiperproliferativas</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/disturbios-da-hemostasia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Distúrbios da Hemostasia</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/tromboelastograma.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Tromboelastograma</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/trombofilias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Trombofilias</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/hemotransfusao-e-reacoes-transfusionais.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Hemotransfusão e Reações Transfusionais</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/policitemia-vera-e-trombocitemia-essencial.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Policitemia Vera e Trombocitemia Essencial</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/leucemias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Leucemias</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/linfomas.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Linfomas</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/mieloma-multiplo.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Mieloma Múltiplo</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/doencas-mononucleose-like.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças Mononucleose-Like</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/neutropenia-febril.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Neutropenia Febril</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hematologia/sindrome-de-lise-tumoral.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Síndrome de Lise Tumoral</h3>
            <span class="resume-tag">Hematologia</span>
        </a>
    </div>
</section>

<!-- Hepatologia -->
<section class="specialty-section" data-specialty="hepatologia">
    <div class="specialty-header">
        <span class="specialty-icon">🧬</span>
        <h2 class="specialty-title">Hepatologia</h2>
        <span class="specialty-count">9 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/introducao-a-hepatologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Hepatologia</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/disturbios-do-metabolismo-da-bilirrubina.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Distúrbios do Metabolismo da Bilirrubina</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/hepatites-virais.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Hepatites Virais</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/hepatite-medicamentosa.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Hepatite Medicamentosa</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/insuficiencia-hepatica-aguda.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Insuficiência Hepática Aguda</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/cirrose-e-suas-causas.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Cirrose e suas Causas</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/cirrose-e-suas-consequencias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Cirrose e suas Consequências</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/tumores-hepaticos.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Tumores Hepáticos</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/hepatologia/transplante-hepatico.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Transplante Hepático</h3>
            <span class="resume-tag">Hepatologia</span>
        </a>
    </div>
</section>

<!-- Infectologia -->
<section class="specialty-section" data-specialty="infectologia">
    <div class="specialty-header">
        <span class="specialty-icon">🦠</span>
        <h2 class="specialty-title">Infectologia</h2>
        <span class="specialty-count">12 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/síndromes_febris.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Síndromes Febris</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/itu.html" class="resume-card" target="_blank">
            <h3 class="resume-title">ITU</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/pneumonias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Pneumonias</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/derrame_pleural_e_abscesso_pulmonar.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Derrame Pleural e Abscesso Pulmonar</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/influenza.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Influenza</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/meningite.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Meningite</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/endocardite_infecciosa.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Endocardite Infecciosa</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/abscesso_hepático_piogênico.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Abscesso Hepático Piogênico</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/parasitoses_intestinais.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Parasitoses Intestinais</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/infecção_relacionada_a_cateter.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Infecção Relacionada a Cateter</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/hiv_aids.html" class="resume-card" target="_blank">
            <h3 class="resume-title">HIV/AIDS</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/infectologia/htlv.html" class="resume-card" target="_blank">
            <h3 class="resume-title">HTLV</h3>
            <span class="resume-tag">Infectologia</span>
        </a>
    </div>
</section>

<!-- Nefrologia -->
<section class="specialty-section" data-specialty="nefrologia">
    <div class="specialty-header">
        <span class="specialty-icon">🫘</span>
        <h2 class="specialty-title">Nefrologia</h2>
        <span class="specialty-count">9 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/introducao-a-nefrologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Nefrologia</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/disturbios-hidroeletroliticos.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Distúrbios Hidroeletrolíticos</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/disturbios-acidobasicos.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Distúrbios Acidobásicos</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/insuficiencia-renal.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Insuficiência Renal</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/glomerulopatias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Glomerulopatias</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/doencas-tubulointersticiais.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças Tubulointersticiais</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/doencas-vasculares-renais.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doenças Vasculares Renais</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/neoplasias-renais.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Neoplasias Renais</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/nefrologia/rim-e-desordens-sistemicas.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Rim e Desordens Sistêmicas</h3>
            <span class="resume-tag">Nefrologia</span>
        </a>
    </div>
</section>

<!-- Neurologia -->
<section class="specialty-section" data-specialty="neurologia">
    <div class="specialty-header">
        <span class="specialty-icon">🧠</span>
        <h2 class="specialty-title">Neurologia</h2>
        <span class="specialty-count">8 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/introducao-a-neurologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Neurologia</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/cefaleias.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Cefaleias</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/epilepsia_e_convulsao_febril.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Epilepsia e Convulsão Febril</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/fraqueza_muscular.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Fraqueza Muscular</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/acidente_vascular_encefalico.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Acidente Vascular Encefálico</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/trombose_venosa_central.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Trombose Venosa Central</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/hic_e_abscesso_cerebral.html" class="resume-card" target="_blank">
            <h3 class="resume-title">HIC e Abscesso Cerebral</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/neurologia/tumores_do_snc.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Tumores do SNC</h3>
            <span class="resume-tag">Neurologia</span>
        </a>
    </div>
</section>

<!-- Pneumologia -->
<section class="specialty-section" data-specialty="pneumologia">
    <div class="specialty-header">
        <span class="specialty-icon">🫁</span>
        <h2 class="specialty-title">Pneumologia</h2>
        <span class="specialty-count">12 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/introducao_a_pneumologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Pneumologia</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/asma.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Asma</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/dpoc.html" class="resume-card" target="_blank">
            <h3 class="resume-title">DPOC</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/fibrose_cistica.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Fibrose Cística</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/pneumopatias_intersticiais_difusas_(pid).html" class="resume-card" target="_blank">
            <h3 class="resume-title">Pneumopatias Intersticiais Difusas (PID)</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/sarcoidose.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Sarcoidose</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/tuberculose.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Tuberculose</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/micoses_pulmonares.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Micoses Pulmonares</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/nodulo_pulmonar_solitario.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Nódulo Pulmonar Solitário</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/cancer_de_pulmao.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Câncer de Pulmão</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/doenca_venosa_profundade_tvp_e_tep.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Doença Venosa Profunda - TVP e TEP</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/pneumologia/hipertensao_arterial_pulmonar.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Hipertensão Arterial Pulmonar</h3>
            <span class="resume-tag">Pneumologia</span>
        </a>
    </div>
</section>

<!-- Reumatologia -->
<section class="specialty-section" data-specialty="reumatologia">
    <div class="specialty-header">
        <span class="specialty-icon">🦴</span>
        <h2 class="specialty-title">Reumatologia</h2>
        <span class="specialty-count">5 resumos</span>
    </div>
    <div class="resumes-grid">
        <a href="https://www.domusmed.site/resumos/especialidades/reumatologia/introducao-a-reumatologia.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Introdução à Reumatologia</h3>
            <span class="resume-tag">Reumatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/reumatologia/artrites.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Artrites</h3>
            <span class="resume-tag">Reumatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/reumatologia/colagenoses.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Colagenoses</h3>
            <span class="resume-tag">Reumatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/reumatologia/vasculites.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Vasculites</h3>
            <span class="resume-tag">Reumatologia</span>
        </a>
        <a href="https://www.domusmed.site/resumos/especialidades/reumatologia/miscelania.html" class="resume-card" target="_blank">
            <h3 class="resume-title">Miscelânia</h3>
            <span class="resume-tag">Reumatologia</span>
        </a>
    </div>
</section>

        <!-- Especialidades Em Breve -->
        <section class="specialty-section" data-specialty="cirurgia">
            <div class="specialty-header">
                <span class="specialty-icon">🔪</span>
                <h2 class="specialty-title">Cirurgia</h2>
                <span class="coming-soon">Em breve</span>
            </div>
        </section>

        <section class="specialty-section" data-specialty="ginecologia">
            <div class="specialty-header">
                <span class="specialty-icon">👩‍⚕️</span>
                <h2 class="specialty-title">Ginecologia</h2>
                <span class="coming-soon">Em breve</span>
            </div>
        </section>

        <section class="specialty-section" data-specialty="obstetricia">
            <div class="specialty-header">
                <span class="specialty-icon">🤰</span>
                <h2 class="specialty-title">Obstetrícia</h2>
                <span class="coming-soon">Em breve</span>
            </div>
        </section>

        <section class="specialty-section" data-specialty="pediatria">
            <div class="specialty-header">
                <span class="specialty-icon">👶</span>
                <h2 class="specialty-title">Pediatria</h2>
                <span class="coming-soon">Em breve</span>
            </div>
        </section>

        <section class="specialty-section" data-specialty="preventiva">
            <div class="specialty-header">
                <span class="specialty-icon">🏥</span>
                <h2 class="specialty-title">Medicina Preventiva e Saúde Pública</h2>
                <span class="coming-soon">Em breve</span>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <img src="https://lh3.googleusercontent.com/d/1CAV1xbDtXy5Pz_lI0dHocMbVNcEJDUyu" alt="DomusMed Logo" class="footer-logo">
            <p>A plataforma completa que combina conhecimento médico tradicional com inteligência artificial para acelerar sua aprovação na residência e excelência clínica.</p>

            <div class="contact-info">
                <span>📧</span>
                <a href="mailto:contato@domusmed.site">contato@domusmed.site</a>
            </div>

            <div class="footer-divider"></div>

            <p class="copyright">© 2025 DomusMed. Todos os direitos reservados.</p>
        </div>
    </footer>

    <script>
        // Sistema de Filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        const specialtySections = document.querySelectorAll('.specialty-section');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Adiciona active no botão clicado
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                specialtySections.forEach(section => {
                    if (filter === 'all') {
                        section.classList.remove('hidden');
                    } else {
                        const specialty = section.getAttribute('data-specialty');
                        if (specialty === filter) {
                            section.classList.remove('hidden');
                        } else {
                            section.classList.add('hidden');
                        }
                    }
                });

                // Scroll suave para o conteúdo
                if (filter !== 'all') {
                    setTimeout(() => {
                        const firstVisibleSection = document.querySelector('.specialty-section:not(.hidden)');
                        if (firstVisibleSection) {
                            firstVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                }
            });
        });

        // Aqui você pode adicionar links individuais para cada card no futuro
        // const resumeCards = document.querySelectorAll('.resume-card');
        // resumeCards.forEach(card => {
        //     card.addEventListener('click', () => {
        //         // Redirecionar para o resumo específico
        //         window.location.href = 'link-do-resumo.html';
        //     });
        // });
    </script>

</body>
</html>
