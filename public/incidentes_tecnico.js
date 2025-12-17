function iniciarPaginaTecnico() {
  configurarPesquisaTecnico();
  carregarIncidentesTecnico();
}

let todosIncidentesTecnico = [];

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarPaginaTecnico);
} else {
  iniciarPaginaTecnico();
}

function configurarPesquisaTecnico() {
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    const newSearchBar = searchBar.cloneNode(true);
    searchBar.parentNode.replaceChild(newSearchBar, searchBar);

    newSearchBar.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase();
      
      const filtrados = todosIncidentesTecnico.filter((inc) => {
        const nome = inc.nome ? inc.nome.toLowerCase() : '';
        const categoria = inc.categoria ? inc.categoria.toLowerCase() : '';
        return nome.includes(termo) || categoria.includes(termo);
      });

      fazerTabelaIncidentesTecnico(filtrados);
    });
  }
}

async function carregarIncidentesTecnico() {
  const tabela = document.querySelector('.table');
  tabela.innerHTML = '';

  try {
    const res = await fetch('/incidentes-tecnico/meus', {
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Falha ao carregar os incidentes.');
    }

    todosIncidentesTecnico = await res.json();
    fazerTabelaIncidentesTecnico(todosIncidentesTecnico);
  } catch (err) {
    console.error(err);
    tabela.innerHTML = '<div class="row">Não foi possível carregar os incidentes.</div>';
  }
}

function fazerTabelaIncidentesTecnico(lista) {
  const tabela = document.querySelector('.table');
  tabela.innerHTML = '';

  if (!lista || lista.length === 0) {
    const vazio = document.createElement('div');
    vazio.classList.add('row');
    vazio.textContent = 'Sem incidentes correspondentes.';
    tabela.appendChild(vazio);
    return;
  }

  lista.forEach((inc) => {
    const row = document.createElement('div');
    row.classList.add('row');

    row.innerHTML = `
      <span>${inc.nome || inc.categoria}</span>
      <select class="prioridade-select" data-id="${inc._id}">
        ${prioridadeOptions(inc.prioridade)}
      </select>
      <select class="estado-select" data-id="${inc._id}">
        ${estadoOptions(inc.estado)}
      </select>
    `;

    const estadoSelect = row.querySelector('.estado-select');
    estadoSelect.addEventListener('change', (event) => {
      mudarEstado(event.target.dataset.id, event.target.value);
    });

    const prioridadeSelect = row.querySelector('.prioridade-select');
    prioridadeSelect.addEventListener('change', (event) => {
      mudarPrioridade(event.target.dataset.id, event.target.value);
    });

    tabela.appendChild(row);
  });
}

function estadoOptions(estadoAtual) {
  const estados = ['Não Resolvido', 'Em Resolução', 'Resolvido'];
  return estados
    .map(
      (estado) =>
        `<option value="${estado}" ${estado === estadoAtual ? 'selected' : ''}>${estado}</option>`
    )
    .join('');
}

function prioridadeOptions(prioridadeAtual = '') {
  const prioridades = ['Baixa', 'Media', 'Alta', 'Urgente'];
  return prioridades
    .map(
      (prioridade) =>
        `<option value="${prioridade}" ${prioridade === prioridadeAtual ? 'selected' : ''}>${prioridade}</option>`
    )
    .join('');
}

async function mudarEstado(id, estado) {
  try {
    const res = await fetch(`/incidentes-tecnico/estado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ estado })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Erro ao atualizar o estado.');
    }

    carregarIncidentesTecnico();
  } catch (err) {
    console.error(err);
    mostrarNotificacao(err.message, 'erro');
    carregarIncidentesTecnico();
  }
}

async function mudarPrioridade(id, prioridade) {
  try {
    const res = await fetch(`/incidentes-tecnico/prioridade/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ prioridade })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Erro ao atualizar a prioridade.');
    }

    carregarIncidentesTecnico();
  } catch (err) {
    console.error(err);
    mostrarNotificacao(err.message, 'erro');
    carregarIncidentesTecnico();
  }
}
