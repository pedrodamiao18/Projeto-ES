const url = "http://localhost:4000/auth";
document.getElementById('registo-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // validacao
    if (!nome || !email || !password) {
        mostrarNotificacao('Tem de preencher todos os dados.', 'erro');
        return;
    }

    // iniciar pedido de registo
    fetch(url + '/registo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //levar para o login para fazer login
            mostrarNotificacao('Registo efetuado com sucesso!', 'sucesso');
            window.location.href = "login.html";
        } else {
            alert('O registo falhou: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro durante o registo:', error);
        mostrarNotificacao('Ocorreu um erro. Tente mais tarde.', 'erro');
    });
});
