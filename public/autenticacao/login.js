const url = "http://localhost:4000/auth";

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
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //o servidor manda o token numa cookie httpOnly
            //dar um alerta do sucesso ao cliente
            alert('Login com sucesso');
            window.location.href = "public/incidentes/incidentes.html";
        } else {
            alert('O login falhou: ' + data.message);
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
            window.location.href = "public/incidentes/incidentes.html";
        }
    })
}