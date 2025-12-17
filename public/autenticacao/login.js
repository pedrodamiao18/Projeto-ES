const url = "/auth";

document.addEventListener('DOMContentLoaded', function () {
   isLoggedIn();
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // validacao
    if (!email || !password) {
        alert('Tem de inserir o email e a password.');
        return;
    }

    // iniciar pedido de login
    fetch(url + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Login efetuado com sucesso!', 'sucesso');
            
            setTimeout(() => {
                window.location.href = "/incidentes/incidentes.html";
            }, 1500);
        } else {
            const mensagem = data.message || data.error || 'Credenciais inválidas.';
            mostrarNotificacao(mensagem, 'erro');
        }
    })
    .catch(error => {
        console.error('Erro durante o login:', error);
        alert('Ocorreu um erro durante o login. Por favor, tente novamente mais tarde.');
    });
});

function isLoggedIn(){
    fetch(url + '/check', {
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) {
            window.location.href = "/incidentes/incidentes.html";
        }
    })
}
