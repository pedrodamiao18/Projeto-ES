document.addEventListener("DOMContentLoaded", async () => {
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
        configurarSidebar(undefined); // fallback esconde opções restritas
    }
});

function configurarSidebar(role) {
    const estatisticasBtn = document.querySelector(".nav-item[data-section='estatisticas']");
    const notificacoesBtn = document.querySelector(".nav-item[data-section='notificacoes']");
    const incidentesBtn = document.querySelector(".nav-item[data-section='incidentes']");

    const registarIncidenteBtn = document.querySelector(".nav-item[data-section='incidentes']");

    const editarIncidentesBtn = document.querySelector(".nav-item[data-section='editar']");

    if (role !== "admin") {
        // Apenas administradores mantêm acesso às estatísticas
        estatisticasBtn?.remove();
    }

    if (role !== "cliente") {
        // Clientes também não vêm área de notificações
        registarIncidenteBtn?.remove();
        editarIncidentesBtn?.remove();
    }

}
