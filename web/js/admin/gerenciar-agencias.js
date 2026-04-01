// Dados temporários para testar a tela (Sem IDs)
let allAgencias = [
  {razao_social: "Aventuras Maranhão LTDA", nome_fantasia: "Aventuras MA", cnpj: "12.345.678/0001-90", email: "contato@aventuras.com", telefone: "(98) 99999-1111", status: "ativo", passeios_ativos: 12 },
  {razao_social: "Lençóis Turismo EIRELI", nome_fantasia: "Lençóis Tour", cnpj: "98.765.432/0001-10", email: "reserva@lencoistour.com", telefone: "(98) 98888-2222", status: "pendente", passeios_ativos: 0 },
  {razao_social: "São Luís Histórico SA", nome_fantasia: "SLZ Viagens", cnpj: "45.678.123/0001-55", email: "slz@viagens.com", telefone: "(98) 97777-3333", status: "bloqueado", passeios_ativos: 5 }
];

let filteredAgencias = [...allAgencias];

// Atualiza os cartões lá de cima
function updateMetrics() {
  document.getElementById("metricTotal").textContent = filteredAgencias.length;
  document.getElementById("metricPendentes").textContent = filteredAgencias.filter(a => a.status === 'pendente').length;
  document.getElementById("metricAtivas").textContent = filteredAgencias.filter(a => a.status === 'ativo').length;
}

// Renderiza a lista sanfona
function renderAgencias(data) {
  const listContainer = document.getElementById("agenciasList");
  const emptyState = document.getElementById("emptyState");
  listContainer.innerHTML = "";

  // Correção da lógica do Empty State
  if (!data || data.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  // Usamos um contador (index) apenas para os elementos HTML não se perderem
  data.forEach((ag, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.id = `agencia-${index}`;

    // PADRONIZAÇÃO DOS BOTÕES
    let botoesAcao = '';
    if(ag.status === 'pendente') {
      botoesAcao = `
        <button class="btn-action btn-unblock" onclick="alterarStatus('${ag.cnpj}', 'ativo')" title="Aprovar">
          <span class="material-symbols-outlined">check_circle</span> Aprovar Agência
        </button>
        <button class="btn-action btn-block" onclick="alterarStatus('${ag.cnpj}', 'rejeitado')" title="Rejeitar">
          <span class="material-symbols-outlined">cancel</span> Rejeitar
        </button>
      `;
    } else {
      botoesAcao = `
        <button class="btn-action btn-edit" onclick="alert('Editando agência: ${ag.nome_fantasia}')">
          <span class="material-symbols-outlined">edit</span> Editar Cadastro
        </button>
        <button class="btn-action btn-block" onclick="alterarStatus('${ag.cnpj}', 'bloqueado')">
          <span class="material-symbols-outlined">block</span> Bloquear Acesso
        </button>
      `;
    }

    item.innerHTML = `
      <div class="list-item-header" onclick="toggleAgencia(${index})">
        
        <div style="display: flex; align-items: center; justify-content: center; width: 50px;">
          <span class="material-symbols-outlined" style="color: #94a3b8; font-size: 28px;">domain</span>
        </div>
        
        <div>
          <h4 style="margin: 0;">${ag.nome_fantasia}</h4>
          <small>CNPJ: ${ag.cnpj}</small>
        </div>
        <div>
          <span style="display:block; font-size: 14px;">${ag.email}</span>
          <small>${ag.telefone}</small>
        </div>
        <div>
           <span class="status-badge ${ag.status}">${ag.status.toUpperCase()}</span>
        </div>
        <span class="material-symbols-outlined arrow-icon">expand_more</span>
      </div>

      <div class="list-item-details">
        <div class="agency-details-grid">
          <div class="info-block">
            <h4>Dados da Empresa</h4>
            <p><strong>Razão Social:</strong> ${ag.razao_social}</p>
            <p><strong>CNPJ:</strong> ${ag.cnpj}</p>
            <p><strong>Passeios Cadastrados:</strong> ${ag.passeios_ativos}</p>
          </div>
          <div class="info-block">
            <h4>Contato Principal</h4>
            <p><strong>E-mail:</strong> ${ag.email}</p>
            <p><strong>Telefone:</strong> ${ag.telefone}</p>
          </div>
        </div>
        <div class="action-bar" style="display: flex; gap: 10px;">
          ${botoesAcao}
        </div>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

function toggleAgencia(index) {
  const el = document.getElementById(`agencia-${index}`);
  const isOpen = el.classList.contains('active');
  
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('active');
    const icon = item.querySelector('.arrow-icon');
    if(icon) icon.textContent = 'expand_more'; // Volta ícone padrão
  });

  if (!isOpen) {
    el.classList.add('active');
    el.querySelector('.arrow-icon').textContent = 'expand_less'; // Ícone pra cima
  }
}

// Simulador de ação agora busca pelo CNPJ
function alterarStatus(cnpj, novoStatus) {
  const agencia = allAgencias.find(a => a.cnpj === cnpj);
  if(agencia && confirm(`Deseja alterar o status da agência ${agencia.nome_fantasia} para ${novoStatus.toUpperCase()}?`)) {
      agencia.status = novoStatus;
      applyFilters(); 
      alert("Status atualizado com sucesso!");
  }
}

function applyFilters() {
  const status = document.getElementById("filterStatus")?.value.toLowerCase().trim();
  const search = document.getElementById("searchAgencia")?.value.toLowerCase().trim();

  filteredAgencias = allAgencias.filter(a => {
    const matchStatus = !status || a.status.toLowerCase() === status;
    const matchSearch = !search || 
                        a.nome_fantasia.toLowerCase().includes(search) || 
                        a.cnpj.includes(search);
    return matchStatus && matchSearch;
  });

  renderAgencias(filteredAgencias);
  updateMetrics();
}

// Eventos e Inicialização
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("btnSearch")?.addEventListener("click", applyFilters);
  document.getElementById("searchAgencia")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  document.getElementById("filterStatus")?.addEventListener("change", applyFilters);
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    const searchInput = document.getElementById("searchAgencia");
    const statusSelect = document.getElementById("filterStatus");
    if(searchInput) searchInput.value = "";
    if(statusSelect) statusSelect.value = "";
    applyFilters();
  });

  // Carrega a tela pela primeira vez
  renderAgencias(allAgencias);
  updateMetrics();

  // Puxa os dados do usuário salvos no login
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario && usuario.email) {
    const adminEmail = document.getElementById('adminEmail');
    if(adminEmail) adminEmail.textContent = usuario.email;
  }
});

// Faz o botão de Sair funcionar
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../../index.html'; // Redireciona para fora
  });
}