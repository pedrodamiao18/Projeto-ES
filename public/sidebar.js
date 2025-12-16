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
    const removeSection = (section) => {
        document
            .querySelectorAll(`.nav-item[data-section='${section}']`)
            .forEach((el) => el.remove());
    };

    const isAdmin = role === "admin";
    const isCliente = role === "cliente";

    if (!isAdmin) {
        removeSection("estatisticas");
    }

    if (!isCliente) {
        removeSection("incidentes"); // tecnicos/admin não registam incidentes
        removeSection("editar");
    } else {
        removeSection("notificacoes"); // clientes deixam de gerir notificações
    }

    if (role !== "tecnico") {
        removeSection("registo-solucao");
    }
}
