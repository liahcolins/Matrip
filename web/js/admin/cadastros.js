/* js/admin/cadastros.js */
const API_BASE = "";

// Script para abrir e fechar a sanfona (Accordion)
function toggleAccordion(id, headerElement) {
    const content = document.getElementById(id);
    if (content) {
        content.classList.toggle('show');
    }
    if (headerElement) {
        headerElement.classList.toggle('active');
    }
}

let modoEdicaoCategoria = false;
let idCategoriaEditando = null;

// Carregar categorias dinamicamente
async function carregarCategorias() {
    const tbody = document.getElementById('listaCategorias');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE}/categorias`);
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        const categorias = await res.json();
        
        tbody.innerHTML = '';
        if (categorias.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Nenhuma categoria cadastrada.</td></tr>`;
            return;
        }

        categorias.forEach(cat => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${cat.nome}</strong></td>
                <td><span class="status-badge ativo">Ativo</span></td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="prepararEdicaoCategoria(${cat.id}, '${cat.nome}', '0')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro ao listar categorias:", err);
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">Erro ao carregar categorias.</td></tr>`;
    }
}

// Função para preparar a edição
function prepararEdicaoCategoria(id, nome, status) {
    modoEdicaoCategoria = true;
    idCategoriaEditando = id;

    // Abre o formulário
    const formContainer = document.getElementById('formCat');
    if (formContainer) formContainer.style.display = 'block';

    // Preenche os campos
    const inputNome = document.getElementById('ma11nome');
    if (inputNome) inputNome.value = nome;
    
    const selectStatus = document.getElementById('ma11status');
    if (selectStatus) selectStatus.value = status;

    // Muda o texto do botão
    const btnSalvar = document.getElementById('btnSalvarCategoria');
    if (btnSalvar) btnSalvar.innerText = "Atualizar Categoria";
}

// Função para resetar e cancelar
function resetarFormCategoria() {
    modoEdicaoCategoria = false;
    idCategoriaEditando = null;
    const form = document.getElementById('formCadastrarCategoria');
    if (form) form.reset();
    
    const btnSalvar = document.getElementById('btnSalvarCategoria');
    if (btnSalvar) btnSalvar.innerText = "Salvar Categoria";
    
    const formContainer = document.getElementById('formCat');
    if (formContainer) formContainer.style.display = 'none';
}

// Lógica de Submit real
document.getElementById('formCadastrarCategoria')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('ma11nome').value.trim();
    const status = document.getElementById('ma11status').value;

    if (!nome) {
        alert("Preencha o nome da categoria!");
        return;
    }

    try {
        if (modoEdicaoCategoria) {
            // Edição simulada ou PUT se implementado futuramente
            alert(`Edição de categoria não disponível na API.`);
        } else {
            const res = await fetch(`${API_BASE}/categorias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Erro ao cadastrar categoria");
            }

            alert("Categoria cadastrada com sucesso!");
        }
        
        resetarFormCategoria();
        carregarCategorias();
    } catch (error) {
        alert("Erro: " + error.message);
    }
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
});