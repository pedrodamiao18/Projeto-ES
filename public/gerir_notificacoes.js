let notificacaoSelecionada = null;
let filtroNotificacoes = 'false';
let roleAtual = null;
let notificacoesEndpoint = '/notificacoes';

async function carregarNotificacoes(lida = filtroNotificacoes) {
  filtroNotificacoes = String(lida);

  const url = `${notificacoesEndpoint}?lida=${encodeURIComponent(filtroNotificacoes)}`;
  try {
    const res = await fetch(url, {
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

      const tecnicoInfo = roleAtual === 'admin' && notificacao.id_utilizador
        ? `<p class="tecnico-info">Técnico: ${notificacao.id_utilizador.name || notificacao.id_utilizador.email}</p>`
        : '';

      const descricao = roleAtual === 'cliente'
        ? notificacao.mensagem
        : incidente.descricao;

      const card = document.createElement("article");
      card.className = "notificacao";

      card.innerHTML = `
        <div>
          <h3>${incidente.nome}</h3>
          <p>${descricao}</p>
          ${tecnicoInfo}
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
    mostrarNotificacao("Não foi possível carregar as notificações.", "erro");
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

  atualizarAcoesModal(notificacao);

  if (roleAtual === 'cliente' && !notificacao.lida) {
    marcarNotificacaoComoLida(notificacao._id)
      .then(() => {
        notificacao.lida = true;
        carregarNotificacoes(filtroNotificacoes);
      })
      .catch((err) => console.error('Erro ao marcar notificação como lida.', err));
  }

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
  if (roleAtual === 'admin') {
    mostrarNotificacao("Apenas técnicos podem aceitar incidentes.", "erro");
    return;
  }

  if (!notificacaoSelecionada) {
    return;
  }

  const incidente = notificacaoSelecionada.id_incidente;
  const prioridade = document.getElementById("modalPrioridade").value;

  if (!prioridade) {
    mostrarNotificacao("Selecione uma prioridade para aceitar a tarefa.", "erro");
    return;
  }
  if (!incidente?._id) {
    mostrarNotificacao("Incidente inválido.", "erro");
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

    mostrarNotificacao(body.message || "Incidente aceite com sucesso", "sucesso");
    fecharModal();
    carregarNotificacoes(filtroNotificacoes);
  } catch (err) {
    console.error(err);
    mostrarNotificacao(err.message, "erro");
  }
}

async function marcarNotificacaoComoLida(idNotificacao) {
  try {
    const res = await fetch(`/notificacoes/${idNotificacao}/lida`, {
      method: 'PATCH',
      credentials: 'include'
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.message || 'Falha ao atualizar notificação.');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function obterRoleAtual() {
  try {
    const res = await fetch('/auth/check', { credentials: 'include' });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    roleAtual = data?.user?.role || null;
    if (roleAtual === 'admin') {
      notificacoesEndpoint = '/admin/notificacoes';
    }
    return roleAtual;
  } catch (err) {
    console.error('Erro ao verificar o utilizador autenticado.', err);
    return null;
  }
}

function prepararInterfaceSomenteLeitura(mensagem = "Apenas técnicos podem aceitar incidentes.") {
  const modalAcoes = document.querySelector(".modal-acoes");
  if (modalAcoes && !modalAcoes.querySelector(".info-admin")) {
    const aviso = document.createElement("p");
    aviso.className = "info-admin";
    aviso.textContent = mensagem;
    modalAcoes.appendChild(aviso);
  }
}

function atualizarAcoesModal(notificacao) {
  const selectPrioridade = document.getElementById("modalPrioridade");
  const botaoAceitar = document.getElementById("modalAceitar");
  const somenteConsulta = roleAtual !== 'tecnico' || Boolean(notificacao?.lida);

  if (selectPrioridade) {
    selectPrioridade.disabled = somenteConsulta;
  }

  if (botaoAceitar) {
    botaoAceitar.disabled = somenteConsulta;
    botaoAceitar.style.display = somenteConsulta ? "none" : "";
  }

  if (roleAtual !== 'tecnico') {
    const mensagem = roleAtual === 'admin'
      ? "Administradores apenas podem consultar notificações dos técnicos."
      : "Clientes apenas podem consultar o histórico de notificações.";
    prepararInterfaceSomenteLeitura(mensagem);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await obterRoleAtual();

  const filtroButtons = document.querySelectorAll(".filtros button");

  filtroButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filtroButtons.forEach((btn) => btn.classList.remove("ativo"));
      button.classList.add("ativo");
      carregarNotificacoes(button.dataset.lida ?? 'false');
    });
  });

  carregarNotificacoes('false');

  if (roleAtual === 'tecnico') {
    document.getElementById("modalAceitar").addEventListener("click", aceitarNotificacao);
  } else {
    const mensagem = roleAtual === 'admin'
      ? "Administradores apenas podem consultar notificações dos técnicos."
      : "Clientes apenas podem consultar o histórico de notificações.";
    prepararInterfaceSomenteLeitura(mensagem);
  }

  document.getElementById("fecharModal").addEventListener("click", fecharModal);
  document.getElementById("detalhesModal").addEventListener("click", (event) => {
    if (event.target.id === "detalhesModal") {
      fecharModal();
    }
  });
});
