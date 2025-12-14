document.addEventListener('DOMContentLoaded', async () => {
  const tabela = document.querySelector('.table');

  try {
    const res = await fetch('/api/incidentes');
    const incidentes = await res.json();

    tabela.innerHTML = '';

    incidentes.forEach(incidentes => {
      const row = document.createElement('div');
      row.classList.add('row');

      row.innerHTML = `
        <span>${incidentes.descricao}</span>
        <span class="status ${getStatusClass(incidentes.estado)}">${incidentes.estado}</span>
      `;

      tabela.appendChild(row);
    });

  } catch (err) {
    console.error('Erro ao carregar incidentes:', err);
  }
});

function getStatusClass(estado) {
  switch (estado.toLowerCase()) {
    case 'aberto': return 'aberto';
    case 'em progresso': return 'progresso';
    case 'resolvido': return 'resolvido';
    default: return '';
  }
}
