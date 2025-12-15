function iniciarPaginaTecnico() {
  carregarIncidentesTecnico();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarPaginaTecnico);
} else {
  iniciarPaginaTecnico();
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

    const incidentes = await res.json();

    if (!incidentes.length) {
      const vazio = document.createElement('div');
      vazio.classList.add('row');
      vazio.textContent = 'Sem incidentes atribuídos.';
      tabela.appendChild(vazio);
      return;
    }

    incidentes.forEach((inc) => {
      const row = document.createElement('div');
      row.classList.add('row');

      row.innerHTML = `
        <span>${inc.nome || inc.categoria}</span>
        <span>${inc.prioridade || 'Sem prioridade'}</span>
        <select data-id="${inc._id}">
          ${estadoOptions(inc.estado)}
        </select>
      `;

      const select = row.querySelector('select');
      select.addEventListener('change', (event) => {
        mudarEstado(event.target.dataset.id, event.target.value);
      });

      tabela.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tabela.innerHTML = '<div class="row">Não foi possível carregar os incidentes.</div>';
  }
}

function estadoOptions(estadoAtual) {
  const estados = ['Por iniciar', 'Aberto', 'Resolvido'];
  return estados
    .map(
      (estado) =>
        `<option value="${estado}" ${estado === estadoAtual ? 'selected' : ''}>${estado}</option>`
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
    alert(err.message);
    carregarIncidentesTecnico();
  }
}
