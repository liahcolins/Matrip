document.addEventListener('DOMContentLoaded', () => {
    // 1. BLINDAGEM DE SEGURANÇA
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    // Verifica se existe usuário e se ele é do tipo 'admin'
    if (!usuario || usuario.tipo !== 'admin') {
        console.warn("Acesso negado: Usuário não autenticado ou sem permissão de admin.");
        window.location.href = '../../login1.html'; // Ajuste o caminho conforme sua pasta
        return;
    }

    // 2. INJEÇÃO DO E-MAIL REAL NA SIDEBAR
    const emailSidebar = document.getElementById('adminEmail');
    if (emailSidebar) {
        emailSidebar.textContent = usuario.email;
    }

    // 3. LÓGICA DO BOTÃO DE SAIR
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Deseja realmente sair do painel administrativo?")) {
                localStorage.removeItem('usuario');
                window.location.href = '../../index.html';
            }
        });
    }
});