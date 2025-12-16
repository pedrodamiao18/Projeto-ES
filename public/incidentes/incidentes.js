async function iniciarIncidentes() {
  carregarIncidentes(); // default: todos do cliente autenticado
}

async function carregarIncidentes(estado = '') {
  const tabela = document.querySelector('.table');

  try {
    const url = estado
      ? `/api/incidentes?estado=${encodeURIComponent(estado)}`
      : '/api/incidentes';

    const res = await fetch(url, {
      credentials: 'include'
    });
    const incidentes = await res.json();

    tabela.innerHTML = '';

    incidentes.forEach((incidente) => {
      const row = document.createElement('div');
      row.classList.add('row');

      row.innerHTML = `
        <span>${incidente.categoria}</span>
        <span class="status ${getStatusClass(incidente.estado)}">
          ${incidente.estado}
        </span>
      `;

      row.addEventListener('click', () => {
        window.location.href = `./editarIncidente.html?id=${incidente._id}`;
      });

      tabela.appendChild(row);
    });
  } catch (err) {
    console.error('Erro ao carregar incidentes:', err);
  }
}

function getStatusClass(estado = '') {
  switch (estado.toLowerCase()) {
    case 'aberto':
      return 'aberto';
    case 'por iniciar':
      return 'por-iniciar';
    case 'resolvido':
      return 'resolvido';
    default:
      return '';
  }
}

const estadoHeader = document.getElementById('estadoHeader');
const estadoDropdown = document.getElementById('estadoDropdown');

estadoHeader.addEventListener('click', (e) => {
  e.stopPropagation();
  estadoDropdown.style.display =
    estadoDropdown.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', () => {
  estadoDropdown.style.display = 'none';
});

estadoDropdown.querySelectorAll('div').forEach((opcao) => {
  opcao.addEventListener('click', () => {
    const estado = opcao.dataset.estado;

    if (estado === 'todos') {
      carregarIncidentes(); // carrega todos
    } else {
      carregarIncidentes(estado); // carrega os necessários
    }

    estadoDropdown.style.display = 'none';
  });
});

document.addEventListener('DOMContentLoaded', iniciarIncidentes);
