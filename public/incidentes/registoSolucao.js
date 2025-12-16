document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Get all elements
    const statusSelect = document.getElementById("status");
    const fileWrapper = document.getElementById("file-input-wrapper");
    const causeWrapper = document.getElementById("cause-wrapper");
    const reasonWrapper = document.getElementById("reason-wrapper");

    function checkStatus() {
        const val = statusSelect.value;

        fileWrapper.style.display = "none";
        causeWrapper.style.display = "none";
        reasonWrapper.style.display = "none";

        if (val === "resolvido") {
            fileWrapper.style.display = "flex";
            causeWrapper.style.display = "flex";
        } 
        else if (val === "nao_resolvido") {
            reasonWrapper.style.display = "flex";
        }
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", checkStatus);
        checkStatus();
    }

});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const incidentId = document.getElementById('incident-id').value;
    const status = document.getElementById('status').value;
    const fileInput = document.getElementById('myfile');
    
    let observacaoText = "";
    if (status === 'resolvido') {
        observacaoText = document.querySelector('#cause-wrapper textarea').value;
    } else {
        observacaoText = document.querySelector('#reason-wrapper textarea').value;
    }

    const payload = {
        incident_id: incidentId,
        status: status,
        observacao: observacaoText,
        pdfFileBase64: null
    };

    if (status === 'resolvido' && fileInput.files.length > 0) {
        try {
            payload.pdfFileBase64 = await toBase64(fileInput.files[0]);
        } catch (error) {
            alert("Erro ao processar ficheiro");
            return;
        }
    }

    try {
        const res = await fetch('/api/incidentes/resolver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            alert("Sucesso: " + data.message);
            window.location.href = 'incidentes.html';
        } else {
            alert("Erro: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Erro de conexão.");
    }
});