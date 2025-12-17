document.getElementById('btnSubmeter').addEventListener('click', async (e) => {
  e.preventDefault();

  const incidente = {
    nome: document.getElementById('nome').value.trim(),
    //data: document.getElementById('data').value,
    tipoIncidente: document.getElementById('tipo').value,
    categoria: document.getElementById('categoria').value,
    descricao: document.getElementById('descricao').value.trim()
  };

  if (!incidente.nome || !incidente.tipoIncidente || !incidente.categoria || !incidente.descricao) {
    mostrarNotificacao('Por favor, preencha todos os campos.', 'erro');
    return;
  }

  try {
    const resposta = await fetch('/api/incidentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(incidente)
    });

    if (resposta.ok) {
      mostrarNotificacao('Incidente registado com sucesso!', 'sucesso');
      document.querySelector('.form-box').reset?.();
    } else {
      mostrarNotificacao('Erro ao registar o incidente.', 'erro');
    }
  } catch (erro) {
    console.error('Erro:', erro);
    mostrarNotificacao('Falha de ligação com o servidor.', 'erro');
  }
});