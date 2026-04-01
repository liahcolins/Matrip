/* js/admin/cadastros.js */

/* ==========================================================================
   FUNÇÕES DA CENTRAL DE CADASTROS (Categorias, Idiomas, Localização)
   ========================================================================== */

// Script para abrir e fechar a sanfona (Accordion)
function toggleAccordion(id, headerElement) {
    const content = document.getElementById(id);
    content.classList.toggle('show');
    headerElement.classList.toggle('active');
}

// Função para abrir/fechar os formulários de cadastro na mesma tela
function toggleFormulario(idDoFormulario) {
    const formulario = document.getElementById(idDoFormulario);
    
    // Se estiver escondido (none), ele mostra (block). Se estiver aparecendo, ele esconde.
    if (formulario.style.display === 'none' || formulario.style.display === '') {
        formulario.style.display = 'block';
    } else {
        formulario.style.display = 'none';
    }
}