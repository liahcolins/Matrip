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

let modoEdicaoCategoria = false;
let idCategoriaEditando = null;

// Função para preparar a edição
function prepararEdicaoCategoria(id, nome, status) {
    modoEdicaoCategoria = true;
    idCategoriaEditando = id;

    // Abre o formulário
    const formContainer = document.getElementById('formCat');
    formContainer.style.display = 'block';

    // Preenche os campos
    document.getElementById('ma11nome').value = nome;
    document.getElementById('ma11status').value = status;

    // Muda o texto do botão
    document.getElementById('btnSalvarCategoria').innerText = "Atualizar Categoria";
}

// Função para resetar e cancelar
function resetarFormCategoria() {
    modoEdicaoCategoria = false;
    idCategoriaEditando = null;
    document.getElementById('formCadastrarCategoria').reset();
    document.getElementById('btnSalvarCategoria').innerText = "Salvar Categoria";
    document.getElementById('formCat').style.display = 'none';
}

// Lógica de Submit (Simulada para você testar o visual)
document.getElementById('formCadastrarCategoria')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('ma11nome').value;
    const status = document.getElementById('ma11status').value;

    alert(modoEdicaoCategoria ? `Categoria ${nome} atualizada!` : "Categoria cadastrada!");
    
    resetarFormCategoria();
    // Aqui você chamaria a função para recarregar a tabela do banco futuramente
});