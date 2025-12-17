async function iniciarIncidentes() {
  carregarIncidentes(); // default: todos do cliente autenticado
}

let todosIncidentes = [];

async function carregarIncidentes(estado = '') {
  const tabela = document.querySelector('.table');

  try {
    const url = estado
      ? `/api/incidentes?estado=${encodeURIComponent(estado)}`
      : '/api/incidentes';

    const res = await fetch(url, {
      credentials: 'include'
    });

    todosIncidentes = await res.json();
    //para depois conseguir pesquisar
    fazerTabelaIncidentes(todosIncidentes);

  } catch (err) {
    console.error('Erro ao carregar incidentes:', err);
  }
}

function fazerTabelaIncidentes(lista) {
  const tabela = document.querySelector('.table');
  tabela.innerHTML = ''; 

  if (lista.length === 0) {
    tabela.innerHTML = '<div class="row no-click" style="justify-content:center;">Sem resultados.</div>';
    return;
  }

  lista.forEach((incidente) => {
    const row = document.createElement('div');
    row.classList.add('row');

    row.innerHTML = `
      <span>${incidente.nome || incidente.categoria}</span>
      <span class="status ${getStatusClass(incidente.estado)}">
        ${incidente.estado}
      </span>
    `;

    row.addEventListener('click', () => {
      window.location.href = `./editarIncidente.html?id=${incidente._id}`;
    });

    tabela.appendChild(row);
  });
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

//search bar implementacao
const searchBar = document.querySelector('.search-bar');

if (searchBar) {
  searchBar.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();

    const incidentesFiltrados = todosIncidentes.filter((inc) => {
      const nome = inc.nome ? inc.nome.toLowerCase() : '';
      const categoria = inc.categoria ? inc.categoria.toLowerCase() : '';
      
      return nome.includes(termo) || categoria.includes(termo);
    });

    //refazer a tabela com os incidentes filtrados
    fazerTabelaIncidentes(incidentesFiltrados);
  });
}

document.addEventListener('DOMContentLoaded', iniciarIncidentes);
