document.addEventListener('DOMContentLoaded', async () => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    return;
  }

  try {
    const res = await fetch('/auth/check', { credentials: 'include' });
    if (!res.ok) {
      return;
    }

    const data = await res.json();
    const role = data?.user?.role;

    if (!role) {
      return;
    }

    sidebar.querySelectorAll('[data-roles]').forEach((item) => {
      const permitido = item.dataset.roles
        .split(',')
        .map((valor) => valor.trim());

      if (!permitido.includes(role)) {
        item.classList.add('nav-item--disabled');
        item.removeAttribute('onclick');
      }
    });
  } catch (err) {
    console.error('Erro ao configurar a sidebar:', err);
  }
});
