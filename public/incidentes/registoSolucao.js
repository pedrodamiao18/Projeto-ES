// Função auxiliar para converter ficheiro para Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);

    const idIncidente = params.get('id');
    const estadoDestino = params.get('estado');

    if (idIncidente) {
        preencherDadosIniciais(idIncidente, estadoDestino);
    }

    const selectIncidente = document.getElementById('incident-id');
    const selectEstado = document.getElementById('status');
    const divCausa = document.getElementById('cause-wrapper');
    const divMotivo = document.getElementById('reason-wrapper');
    const divFicheiro = document.getElementById('file-input-wrapper');
    const form = document.querySelector('.form-container');


    try {
        const res = await fetch('/resolver', { credentials: 'include' });

        if (!res.ok) {
            throw new Error('Erro ao buscar incidentes');
        }

        const incidentes = await res.json();

        if (!idIncidente) {
        selectIncidente.innerHTML = '<option value="" selected disabled>Selecione o incidente...</option>';
        }

        if (incidentes.length === 0) {
            const option = document.createElement('option');
            option.text = "Sem incidentes pendentes atribuídos";
            option.disabled = true;
            selectIncidente.appendChild(option);
        } else {
            incidentes.forEach(inc => {
                const option = document.createElement('option');
                option.value = inc._id;
                const dataFormatada = new Date(inc.data).toLocaleDateString('pt-PT');
                option.textContent = `${inc.nome} (${dataFormatada})`;
                selectIncidente.appendChild(option);
            });
        }

    } catch (err) {
        console.error("Erro ao carregar incidentes:", err);
        alert("Erro ao carregar a lista de incidentes.");
    }


    function checkStatus() {
        const val = selectEstado.value;

        divFicheiro.style.display = "none";
        divCausa.style.display = "none";
        divMotivo.style.display = "none";

        if (val === "resolvido") {
            divFicheiro.style.display = "flex";
            divCausa.style.display = "flex";
        }
        else if (val === "nao_resolvido") {
            divMotivo.style.display = "flex";
        }
    }

    if (selectEstado) {
        selectEstado.addEventListener("change", checkStatus);
        checkStatus();
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const incidentId = selectIncidente.value;
            const status = selectEstado.value;
            const fileInput = document.getElementById('myfile');

            // Validação básica
            if (!incidentId) {
                alert("Por favor selecione um incidente.");
                return;
            }
            if (!status) {
                alert("Por favor selecione um estado.");
                return;
            }

            let observacaoText = "";
            if (status === 'resolvido') {
                observacaoText = document.querySelector('#cause-wrapper textarea').value;
            } else {
                observacaoText = document.querySelector('#reason-wrapper textarea').value;
            }

            // Construir o Payload
            const payload = {
                incident_id: incidentId,
                status: status,
                observacao: observacaoText,
                pdfFileBase64: null
            };

            if (status === 'resolvido') {
                if (fileInput.files.length > 0) {
                    try {
                        payload.pdfFileBase64 = await toBase64(fileInput.files[0]);
                    } catch (error) {
                        alert("Erro ao processar ficheiro PDF.");
                        return;
                    }
                } else {
                    alert("Para resolver um incidente, é obrigatório anexar o relatório.");
                    return;
                }
            }

            try {
                const res = await fetch('/resolver', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (res.ok) {
                    mostrarNotificacao("Submetido com sucesso!", 'sucesso');
                    window.location.href = 'incidentes.html';
                } else {
                    mostrarNotificao("Erro ao submeter!", 'erro');
                }
            } catch (err) {
                console.error(err);
                alert("Erro de conexão com o servidor.");
            }
        });
    }
});

function preencherDadosIniciais(id, estado) {
  const selectIncidente = document.getElementById('incident-id');
  const selectStatus = document.getElementById('status');

  if (selectIncidente) {
    selectIncidente.value = id;
  }

  if (selectStatus) {
    selectStatus.value = estado;
  }
}