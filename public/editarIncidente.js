const params = new URLSearchParams(window.location.search);
const incidenteId = params.get('id');

if (!incidenteId) {
  alert('Incidente não encontrado');
}
