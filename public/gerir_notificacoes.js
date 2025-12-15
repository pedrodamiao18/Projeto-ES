let notificacaoSelecionada = null;
let filtroNotificacoes = 'false';

async function carregarNotificacoes(lida = filtroNotificacoes) {
  filtroNotificacoes = String(lida);
  try {
    const res = await fetch(`/notificacoes?lida=${filtroNotificacoes}`, {
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Falha ao carregar notificações");
    }

    const notificacoes = await res.json();
    const container = document.getElementById("listaNotificacoes");
    container.innerHTML = "";

    if (!notificacoes.length) {
      const vazio = document.createElement("div");
      vazio.className = "estado-vazio";
      vazio.textContent = filtroNotificacoes === 'true'
        ? "Sem notificações lidas."
        : "Sem notificações novas.";
      container.appendChild(vazio);
      return;
    }

    notificacoes.forEach((notificacao) => {
      const incidente = notificacao.id_incidente;

      if (!incidente) {
        return;
      }

      const card = document.createElement("article");
      card.className = "notificacao";

      card.innerHTML = `
        <div>
          <h3>${incidente.nome}</h3>
          <p>${incidente.descricao}</p>
        </div>
        <div class="acoes">
          <button type="button" data-id="${notificacao._id}">Detalhes</button>
        </div>
      `;

      card.querySelector("button").addEventListener("click", () => {
        abrirModal(notificacao);
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert("Não foi possível carregar as notificações.");
  }
}

function abrirModal(notificacao) {
  notificacaoSelecionada = notificacao;
  const incidente = notificacao.id_incidente;
  const modal = document.getElementById("detalhesModal");

  document.getElementById("modalTitulo").textContent = incidente?.nome || "Incidente";
  document.getElementById("modalDescricao").textContent = incidente?.descricao || "";

  const detalhes = document.getElementById("modalDetalhes");
  detalhes.innerHTML = `
    <li><strong>Categoria:</strong> ${incidente?.categoria || "-"}</li>
    <li><strong>Tipo:</strong> ${incidente?.tipoIncidente || "-"}</li>
    <li><strong>Data:</strong> ${formatarData(incidente?.data)}</li>
    <li><strong>Estado:</strong> ${incidente?.estado || "-"}</li>
  `;

  const selectPrioridade = document.getElementById("modalPrioridade");
  selectPrioridade.value = incidente?.prioridade || "";

  modal.classList.add("ativo");
  modal.setAttribute("aria-hidden", "false");
}

function fecharModal() {
  const modal = document.getElementById("detalhesModal");
  modal.classList.remove("ativo");
  modal.setAttribute("aria-hidden", "true");
  notificacaoSelecionada = null;
}

function formatarData(dataIso) {
  if (!dataIso) return "-";
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) {
    return "-";
  }
  return data.toLocaleDateString("pt-PT");
}

async function aceitarNotificacao() {
  if (!notificacaoSelecionada) {
    return;
  }

  const incidente = notificacaoSelecionada.id_incidente;
  const prioridade = document.getElementById("modalPrioridade").value;

  if (!prioridade) {
    alert("Selecione uma prioridade para aceitar a tarefa.");
    return;
  }
  if (!incidente?._id) {
    alert("Incidente inválido.");
    return;
  }

  try {
    const res = await fetch("/incidentes-tecnico/aceitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_incidente: incidente?._id, prioridade })
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message || "Não foi possível aceitar o incidente");
    }

    alert(body.message || "Incidente aceite com sucesso");
    fecharModal();
    carregarNotificacoes(filtroNotificacoes);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function logoutRapido() {
  try {
    const res = await fetch("/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Não foi possível terminar sessão.");
    }

    window.location.href = "login.html";
  } catch (err) {
    console.error("Erro no logout:", err);
    alert("Não foi possível terminar sessão automaticamente. Tente novamente.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filtroButtons = document.querySelectorAll(".filtros button");

  filtroButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filtroButtons.forEach((btn) => btn.classList.remove("ativo"));
      button.classList.add("ativo");
      carregarNotificacoes(button.dataset.lida ?? 'false');
    });
  });

  carregarNotificacoes('false');

  document.getElementById("modalAceitar").addEventListener("click", aceitarNotificacao);
  document.getElementById("fecharModal").addEventListener("click", fecharModal);
  document.getElementById("detalhesModal").addEventListener("click", (event) => {
    if (event.target.id === "detalhesModal") {
      fecharModal();
    }
  });

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutRapido);
  }
});
