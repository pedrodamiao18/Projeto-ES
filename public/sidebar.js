document.addEventListener("DOMContentLoaded", async () => {
    criarSidebar();
    try {
        const resposta = await fetch("/auth/check", {
            method: "GET",
            credentials: "include", // envia o cookie com o token
        });

        if (!resposta.ok) throw new Error("Não foi possível obter o utilizador");

        const { isLoggedIn, user } = await resposta.json();

        if (!isLoggedIn || !user) throw new Error("Sessão inválida");

        configurarSidebar(user.role);
    } catch (err) {
        console.warn("⚠️ Utilizador não autenticado ou erro na autenticação:", err);
        configurarSidebar(undefined); 
    }
});

function criarSidebar() {
    const sidebarHTML = `
      <div class="nav-section">
        <div class="nav-item" data-section="dashboard" title="Dashboard" onclick="window.location.href='/incidentes/incidentes.html'">
          <i data-lucide="layout-dashboard"></i>
        </div>
        
        <div class="nav-item" data-section="incidentes" title="Registar Incidente" onclick="window.location.href='/incidentes/registoIncidente.html'">
          <i data-lucide="alert-triangle"></i>
        </div>
        
        <div class="nav-item" data-section="notificacoes" title="Notificações" onclick="window.location.href='/gerir_notificacoes.html'">
          <i data-lucide="bell"></i>
        </div>
        
        <div class="nav-item" data-section="registo-solucao" title="Registar solução" onclick="window.location.href='/incidentes/registoSolucao.html'">
          <i data-lucide="clipboard-check"></i>
        </div>
        
        <div class="nav-item" data-section="estatisticas" title="Estatísticas" onclick="window.location.href='/estatisticas.html'">
          <i data-lucide="bar-chart-3"></i>
        </div>
      </div>
    
      <div class="nav-section">
        <div class="nav-item" data-section="perfil" title="Perfil" onclick="window.location.href='/perfil/perfil.html'">
          <i data-lucide="user"></i>
        </div>
      </div>
    `;

    const sidebarContainer = document.querySelector('aside.sidebar');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHTML;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        marcarItemAtivo();
    }
}

function marcarItemAtivo() {
    const path = window.location.pathname;
    const items = document.querySelectorAll('.nav-item');

    items.forEach(item => {
        item.classList.remove('active');
        
        const onClickAttr = item.getAttribute('onclick');
        
        if (onClickAttr && onClickAttr.includes(path)) {
            item.classList.add('active');
        }
    });
}

function configurarSidebar(role) {
    const hideSection = (section) => {
        document
            .querySelectorAll(`.nav-item[data-section='${section}']`)
            .forEach((el) => el.style.display = 'none');
    };

    const showSection = (section) => {
        document
            .querySelectorAll(`.nav-item[data-section='${section}']`)
            .forEach((el) => {
                el.style.display = 'flex';
                el.style.setProperty('display', 'flex', 'important');
            });
    };

    hideSection("estatisticas");
    hideSection("notificacoes");
    hideSection("registo-solucao");
    hideSection("editar");

    if (role === "admin") {
        showSection("estatisticas");
        showSection("notificacoes");
    }

    if (role === "tecnico") {
        showSection("notificacoes");
        showSection("registo-solucao");
        hideSection("incidentes");
    }

    if (role === "cliente") {
    }
}

