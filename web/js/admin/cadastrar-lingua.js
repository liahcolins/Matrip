// 1. Variáveis de controle no topo do arquivo
let modoEdicaoIdioma = false;
let idIdiomaEditando = null;

// 2. Função que o botão do lápis (HTML) chama
function prepararEdicao(id, nomeAtual) {
    modoEdicaoIdioma = true;
    idIdiomaEditando = id;

    // Abre o formulário se estiver escondido
    const formContainer = document.getElementById('formLingua');
    if (formContainer.style.display === 'none') {
        toggleFormulario('formLingua');
    }

    // Preenche o campo de texto com o nome atual
    const inputNome = document.getElementById('ma03nome');
    inputNome.value = nomeAtual;
    inputNome.focus();

    // Muda o texto do botão para o usuário saber que está editando
    const btnSalvar = document.querySelector('#formCadastrarLingua .primary-btn');
    btnSalvar.innerText = "Atualizar Idioma";
}

// 3. Lógica de envio (Submit) do formulário
document.getElementById('formCadastrarLingua')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nomeIdioma = document.getElementById('ma03nome').value;
    const btnSalvar = e.target.querySelector('.primary-btn');

    // Define a URL e o Método dependendo se é edição ou cadastro novo
    const url = modoEdicaoIdioma 
        ? `/api/admin/idiomas/${idIdiomaEditando}` 
        : '/api/admin/idiomas';
    
    const metodo = modoEdicaoIdioma ? 'PUT' : 'POST';

    try {
        btnSalvar.innerText = "Processando...";
        btnSalvar.disabled = true;

        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ma03nome: nomeIdioma })
        });

        if (response.ok) {
            alert(modoEdicaoIdioma ? "Idioma atualizado!" : "Idioma cadastrado!");
            
            // Limpa tudo e volta ao estado normal
            resetarFormIdioma();
            // Aqui você chamaria sua função de recarregar a tabela do banco
            // carregarTabelaIdiomas(); 
        } else {
            alert("Erro ao salvar idioma.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.innerText = modoEdicaoIdioma ? "Atualizar Idioma" : "Salvar Idioma";
    }
});

// 4. Função para resetar o formulário (chame isso no botão Cancelar também)
function resetarFormIdioma() {
    modoEdicaoIdioma = false;
    idIdiomaEditando = null;
    document.getElementById('formCadastrarLingua').reset();
    document.querySelector('#formCadastrarLingua .primary-btn').innerText = "Salvar Idioma";
    document.getElementById('formLingua').style.display = 'none';
}