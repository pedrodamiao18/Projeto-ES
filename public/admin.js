async function iniciarIncidentesAdmin() {
  configurarPesquisaAdmin();
  carregarIncidentesAdmin(); // default: lista completa para o admin
}

let todosIncidentesAdmin = [];

function configurarPesquisaAdmin() {
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    //ter cuidado com listeners antigos
    const newSearchBar = searchBar.cloneNode(true);
    searchBar.parentNode.replaceChild(newSearchBar, searchBar);

    newSearchBar.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase();
      
      const filtrados = todosIncidentesAdmin.filter((inc) => {
        const nome = inc.nome ? inc.nome.toLowerCase() : '';
        const categoria = inc.categoria ? inc.categoria.toLowerCase() : '';
        return nome.includes(termo) || categoria.includes(termo);
      });

      fazerTabelaIncidentesAdmin(filtrados);
    });
  }
}

async function carregarIncidentesAdmin(estado = '') {
  const tabela = document.querySelector('.table');

  try {
    const url = estado
      ? `/admin/incidentes?estado=${encodeURIComponent(estado)}`: '/admin/incidentes';

    const res = await fetch(url, {
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Não foi possível carregar os incidentes.');
    }

    todosIncidentesAdmin = await res.json();
    fazerTabelaIncidentesAdmin(todosIncidentesAdmin);
  } catch (err) {
    console.error('Erro ao carregar incidentes:', err);
  }
}

function fazerTabelaIncidentesAdmin(lista) {
  const tabela = document.querySelector('.table');
  tabela.innerHTML = '';

  if (!lista || lista.length === 0) {
    tabela.innerHTML = '<div class="row no-click" style="justify-content:center;">Sem resultados.</div>';
    return;
  }

  lista.forEach((incidente) => {
    const row = document.createElement('div');
    row.classList.add('row', 'no-click');
    row.title = 'Apenas leitura para o administrador';

    row.innerHTML = `
      <span>${incidente.nome || incidente.categoria}</span>
      <span class="status prioridade">${incidente.prioridade || 'Sem prioridade'}</span>
      <span class="status ${getStatusClass(incidente.estado)}">
        ${incidente.estado}
      </span>
    `;

    tabela.appendChild(row);
  });
}

function getStatusClass(estado = '') {
  switch (estado.toLowerCase()) {
    case 'aberto':return 'aberto';
    case 'por iniciar':return 'por-iniciar';
    case 'resolvido':return 'resolvido';
    default:return '';
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

estadoDropdown.querySelectorAll('div').forEach(opcao => {
  opcao.addEventListener('click', () => {
    const estado = opcao.dataset.estado;

    if (estado === 'todos') {
      carregarIncidentesAdmin();//carrega todos
    } else {
      carregarIncidentesAdmin(estado);//carrega os necessários
    }

    estadoDropdown.style.display = 'none';
  });
});
