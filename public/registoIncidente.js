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
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    const resposta = await fetch('/api/incidentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidente)
    });

    if (resposta.ok) {
      alert('Incidente registado com sucesso!');
      document.querySelector('.form-box').reset?.(); 
    } else {
      alert('Erro ao registar o incidente.');
    }
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Falha de ligação com o servidor.');
  }
});