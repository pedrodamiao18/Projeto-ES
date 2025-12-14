const params = new URLSearchParams(window.location.search);
const incidenteId = params.get('id');

if (!incidenteId) {
  alert('Incidente não encontrado');
}
document.addEventListener('DOMContentLoaded', async () => {
  if (!incidenteId) return;
  const curtoId = incidenteId.slice(-4);
document.getElementById('incidenteIdTitulo').textContent = `#${curtoId}`;


  try {
    const res = await fetch(`/api/incidentes/${incidenteId}`);
    const incidente = await res.json();

    // Campos editáveis
   
    document.getElementById('data').value = incidente.data?.slice(0, 10);
    document.getElementById('descricao').value = incidente.descricao;
    document.getElementById('categoria').value = incidente.categoria;
    preencherTipos(incidente.categoria, incidente.tipoIncidente);

    // Campos bloqueados
    document.getElementById('estado').textContent = incidente.estado;
    document.getElementById('tecnico').textContent =
      incidente.id_tecnico?.nome || 'Não atribuído';

  } catch (err) {
    console.error('Erro ao carregar incidente:', err);
  }
});


document.getElementById('formEditar').addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    data: document.getElementById('data').value,
    tipoIncidente: document.getElementById('tipo').value,
    categoria: document.getElementById('categoria').value,
    descricao: document.getElementById('descricao').value
  };

  await fetch(`/api/incidentes/${incidenteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  alert('Incidente atualizado com sucesso');
  location.reload();
});

function preencherTipos(categoria, tipoSelecionado) {
  const tipoSelect = document.getElementById('tipo');
  tipoSelect.innerHTML = '<option value="">-- Selecione --</option>';

  if (tiposPorCategoria[categoria]) {
    tiposPorCategoria[categoria].forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;

      if (tipo === tipoSelecionado) {
        option.selected = true;
      }

      tipoSelect.appendChild(option);
    });
  }
}

