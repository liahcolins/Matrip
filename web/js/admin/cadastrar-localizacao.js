document.addEventListener('DOMContentLoaded', () => {
    carregarPaises();
});

let estadoTela = 'paises'; // paises | estados | cidades
let dadosContexto = { paisId: null, paisNome: '', ufId: null, ufNome: '' };

// --- NAVEGAÇÃO E VOLTAR ---
function gerenciarBotaoVoltar(e) {
    if (estadoTela === 'paises') return; // Segue o link natural para cadastros.html

    e.preventDefault();
    if (estadoTela === 'cidades') {
        abrirNivelEstados(dadosContexto.paisId, dadosContexto.paisNome);
    } else if (estadoTela === 'estados') {
        exibirPaises();
    }
}

document.getElementById('btnVoltarDinamico').addEventListener('click', gerenciarBotaoVoltar);

function exibirPaises() {
    estadoTela = 'paises';
    document.getElementById('sessaoPaises').style.display = 'block';
    document.getElementById('sessaoEstados').style.display = 'none';
    document.getElementById('sessaoCidades').style.display = 'none';
    document.getElementById('subtituloPagina').innerText = 'Clique nos títulos para abrir os formulários de cadastro.';
    carregarPaises();
}

// --- FUNÇÕES DE CARGA ---
async function carregarPaises() {
    const res = await fetch('/api/localidades/paises');
    const paises = await res.json();
    const tbody = document.getElementById('listaPaises');
    tbody.innerHTML = '';

    if (paises.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:20px;">Nenhum país cadastrado.</td></tr>';
        return;
    }

    paises.forEach(p => {
        tbody.innerHTML += `
            <tr onclick="abrirNivelEstados(${p.id}, '${p.nome}')" style="cursor:pointer">
                <td><strong>${p.nome}</strong></td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="event.stopPropagation(); editarPais(${p.id})">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
}

async function abrirNivelEstados(id, nome) {
    estadoTela = 'estados';
    dadosContexto.paisId = id;
    dadosContexto.paisNome = nome;

    document.getElementById('sessaoPaises').style.display = 'none';
    document.getElementById('sessaoEstados').style.display = 'block';
    document.getElementById('sessaoCidades').style.display = 'none';
    document.getElementById('labelNomePais').innerText = nome;
    document.getElementById('subtituloPagina').innerText = `Países > ${nome}`;
    document.getElementById('fk08idpais').value = id;

    const res = await fetch(`/api/localidades/ufs/${id}`);
    const ufs = await res.json();
    const tbody = document.getElementById('listaEstados');
    tbody.innerHTML = '';

    ufs.forEach(uf => {
        tbody.innerHTML += `
            <tr onclick="abrirNivelCidades(${uf.id}, '${uf.nome}')" style="cursor:pointer">
                <td>${uf.sigla}</td>
                <td><strong>${uf.nome}</strong></td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="event.stopPropagation(); editarUF(${uf.id})">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action btn-block" onclick="event.stopPropagation(); excluirUF(${uf.id})">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
}

async function abrirNivelCidades(id, nome) {
    estadoTela = 'cidades';
    dadosContexto.ufId = id;
    dadosContexto.ufNome = nome;

    document.getElementById('sessaoEstados').style.display = 'none';
    document.getElementById('sessaoCidades').style.display = 'block';
    document.getElementById('labelNomeUF').innerText = nome;
    document.getElementById('subtituloPagina').innerText = `Países > ${dadosContexto.paisNome} > ${nome}`;
    document.getElementById('fk09iduf').value = id;

    const res = await fetch(`/api/localidades/cidades/${id}`);
    const cidades = await res.json();
    const tbody = document.getElementById('listaCidades');
    tbody.innerHTML = '';

    cidades.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.nome}</td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button class="btn-action btn-edit" onclick="editarCidade(${c.id})"><span class="material-symbols-outlined">edit</span></button>
                        <button class="btn-action btn-block" onclick="excluirCidade(${c.id})"><span class="material-symbols-outlined">delete</span></button>
                    </div>
                </td>
            </tr>`;
    });
}

// Helper to open/close forms (fallback if toggleFormulario is not in index-admin.js)
function toggleFormulario(id) {
    const form = document.getElementById(id);
    if (form) {
        form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
    }
}
window.toggleFormulario = toggleFormulario;

// --- SUBMIT HANDLERS ---

// 1. Cadastrar País
document.getElementById('formCadastrarPais')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('ma08nome').value.trim();

    try {
        const res = await fetch('/api/localidades/paises', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome })
        });

        if (!res.ok) throw new Error("Erro ao cadastrar país");

        alert("País cadastrado com sucesso!");
        document.getElementById('formCadastrarPais').reset();
        toggleFormulario('formPais');
        exibirPaises();
    } catch (err) {
        alert("Erro: " + err.message);
    }
});

// 2. Cadastrar Estado (UF)
document.getElementById('formCadastrarUF')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('ma09nome').value.trim();
    const sigla = document.getElementById('ma09sigla').value.trim();
    const paisId = document.getElementById('fk08idpais').value;

    try {
        const res = await fetch('/api/localidades/ufs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sigla, paisId })
        });

        if (!res.ok) throw new Error("Erro ao cadastrar estado");

        alert("Estado cadastrado com sucesso!");
        document.getElementById('formCadastrarUF').reset();
        toggleFormulario('formEstado');
        abrirNivelEstados(dadosContexto.paisId, dadosContexto.paisNome);
    } catch (err) {
        alert("Erro: " + err.message);
    }
});

// 3. Cadastrar Cidade
document.getElementById('formCadastrarCidade')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('ma10nome').value.trim();
    const ufId = document.getElementById('fk09iduf').value;

    try {
        const res = await fetch('/api/localidades/cidades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, ufId })
        });

        if (!res.ok) throw new Error("Erro ao cadastrar cidade");

        alert("Cidade cadastrada com sucesso!");
        document.getElementById('formCadastrarCidade').reset();
        toggleFormulario('formCidade');
        abrirNivelCidades(dadosContexto.ufId, dadosContexto.ufNome);
    } catch (err) {
        alert("Erro: " + err.message);
    }
});
