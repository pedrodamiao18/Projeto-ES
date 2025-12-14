document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/auth/check', {
      credentials: 'include'
    });

    const data = await res.json();

    if (!data.isLoggedIn) {
      window.location.href = 'login.html';
      return;
    }

    const user = data.user;

    document.getElementById('nome').textContent = user.name;
    document.getElementById('email').textContent = user.email;
    document.getElementById('role').textContent = user.role;

    // Mostrar secções conforme o perfil
    if (user.role === 'cliente') {
      document.getElementById('cliente-actions').classList.remove('hidden');
    }

    if (user.role === 'tecnico') {
      document.getElementById('tecnico-actions').classList.remove('hidden');
    }

    if (user.role === 'admin') {
      document.getElementById('admin-actions').classList.remove('hidden');
    }

  } catch (err) {
    console.error(err);
    alert('Erro ao carregar perfil.');
  }
});

// Logout
document.getElementById('logout').addEventListener('click', async () => {
  await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  window.location.href = 'login.html';
});
