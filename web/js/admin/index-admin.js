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

// Função Global para Abrir/Fechar Formulários com Animação
function toggleFormulario(idConteiner) {
    const conteiner = document.getElementById(idConteiner);
    if (!conteiner) return;

    if (conteiner.style.display === "none" || conteiner.style.display === "") {
        // ENTRADA
        conteiner.classList.remove('form-saindo');
        conteiner.style.display = "block";
        conteiner.classList.add('form-animado');

        // Tenta focar no primeiro input que encontrar
        const primeiroInput = conteiner.querySelector('input:not([type="hidden"])');
        if (primeiroInput) setTimeout(() => primeiroInput.focus(), 100);
        
    } else {
        // SAÍDA
        conteiner.classList.remove('form-animado');
        conteiner.classList.add('form-saindo');

        setTimeout(() => {
            conteiner.style.display = "none";
            conteiner.classList.remove('form-saindo');
            
            // Limpa o formulário automaticamente se houver um <form> dentro
            const formularioInterno = conteiner.querySelector('form');
            if (formularioInterno) formularioInterno.reset();
            
            // Se houver lógica de edição (como nos Idiomas), reseta as flags globais
            if (typeof modoEdicaoIdioma !== 'undefined') modoEdicaoIdioma = false;
        }, 300); // Tempo batendo com o CSS
    }
}

