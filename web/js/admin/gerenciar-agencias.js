// Dados temporários para testar a tela
let allAgencias = [
  {razao_social: "Aventuras Maranhão LTDA", nome_fantasia: "Aventuras MA", cnpj: "12.345.678/0001-90", email: "contato@aventuras.com", telefone: "(98) 99999-1111", status: "ativo", passeios_ativos: 12 },
  {razao_social: "Lençóis Turismo EIRELI", nome_fantasia: "Lençóis Tour", cnpj: "98.765.432/0001-10", email: "reserva@lencoistour.com", telefone: "(98) 98888-2222", status: "pendente", passeios_ativos: 0 },
  {razao_social: "São Luís Histórico SA", nome_fantasia: "SLZ Viagens", cnpj: "45.678.123/0001-55", email: "slz@viagens.com", telefone: "(98) 97777-3333", status: "bloqueado", passeios_ativos: 5 }
];

let filteredAgencias = [...allAgencias];

// 1. ATUALIZA AS MÉTRICAS DO TOPO
function updateMetrics() {
  document.getElementById("metricTotal").textContent = filteredAgencias.length;
  document.getElementById("metricPendentes").textContent = filteredAgencias.filter(a => a.status === 'pendente').length;
  document.getElementById("metricAtivas").textContent = filteredAgencias.filter(a => a.status === 'ativo').length;
}

// 2. RENDERIZA A LISTA SANFONA
function renderAgencias(data) {
  const listContainer = document.getElementById("agenciasList");
  const emptyState = document.getElementById("emptyState");
  listContainer.innerHTML = "";

  if (!data || data.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  data.forEach((ag, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.id = `agencia-${index}`;

    let botoesAcao = ag.status === 'pendente' ? `
        <button class="btn-action btn-unblock" onclick="alterarStatus('${ag.cnpj}', 'ativo')" title="Aprovar">
          <span class="material-symbols-outlined">check_circle</span> Aprovar Agência
        </button>
        <button class="btn-action btn-block" onclick="alterarStatus('${ag.cnpj}', 'rejeitado')" title="Rejeitar">
          <span class="material-symbols-outlined">cancel</span> Rejeitar
        </button>
      ` : `
        <button class="btn-action btn-edit" onclick="alert('Editando agência: ${ag.nome_fantasia}')">
          <span class="material-symbols-outlined">edit</span> Editar Cadastro
        </button>
        <button class="btn-action btn-block" onclick="alterarStatus('${ag.cnpj}', 'bloqueado')">
          <span class="material-symbols-outlined">block</span> Bloquear Acesso
        </button>
      `;

    // LAYOUT REVISADO: Status alinhado à esquerda e ícones (guia e seta) na direita
    item.innerHTML = `
      <div class="list-item-header" style="display: flex; align-items: center; padding: 15px 20px; cursor: pointer; gap: 10px;">
        
        <div style="display: flex; align-items: center; gap: 15px; flex: 2.5;" onclick="toggleAgencia(${index})">
          <span class="material-symbols-outlined" style="color: #94a3b8; font-size: 28px;">domain</span>
          <div>
            <h4 style="margin: 0; color: #023847;">${ag.nome_fantasia}</h4>
            <small style="color: #64748b;">CNPJ: ${ag.cnpj}</small>
          </div>
        </div>

        <div style="flex: 2; color: #475569;" onclick="toggleAgencia(${index})">
          <span style="display:block; font-size: 14px; font-weight: 500;">${ag.email}</span>
          <small style="color: #94a3b8;">${ag.telefone}</small>
        </div>

        <div style="flex: 1.2; display: flex; justify-content: flex-start;" onclick="toggleAgencia(${index})">
          <span class="status-badge ${ag.status}" style="white-space: nowrap; min-width: 100px; text-align: center;">
            ${ag.status.toUpperCase()}
          </span>
        </div>

        <div style="flex: 0.8; display: flex; align-items: center; justify-content: flex-end; gap: 25px;">
          <button class="btn-action" onclick="event.stopPropagation(); abrirGestaoGuias('${ag.cnpj}', '${ag.nome_fantasia}')" 
                  title="Gerenciar Guias" 
                  style="background: rgba(2, 56, 71, 0.08); color: #023847; border: none; padding: 10px; border-radius: 8px; cursor: pointer; display: flex; align-items: center;">
            <span class="material-symbols-outlined" style="font-size: 22px;">explore</span>
          </button>
          
          <span class="material-symbols-outlined arrow-icon" onclick="toggleAgencia(${index})" style="color: #cbd5e1; user-select: none;">expand_more</span>
        </div>
      </div>

      <div class="list-item-details">
        <div class="agency-details-grid">
          <div class="info-block">
            <h4>Dados da Empresa</h4>
            <p><strong>Razão Social:</strong> ${ag.razao_social}</p>
            <p><strong>CNPJ:</strong> ${ag.cnpj}</p>
            <p><strong>Produtos Cadastrados:</strong> ${ag.passeios_ativos}</p>
          </div>
          <div class="info-block">
            <h4>Contato Principal</h4>
            <p><strong>E-mail:</strong> ${ag.email}</p>
            <p><strong>Telefone:</strong> ${ag.telefone}</p>
          </div>
        </div>
        <div class="action-bar" style="display: flex; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
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
    if(icon) icon.textContent = 'expand_more';
  });

  if (!isOpen) {
    el.classList.add('active');
    el.querySelector('.arrow-icon').textContent = 'expand_less';
  }
}

// REDIRECIONAMENTO PARA A PÁGINA "AGENCIA-GUIAS"
function abrirGestaoGuias(cnpj, nome) {
    const nomeEncoded = encodeURIComponent(nome);
    const cnpjEncoded = encodeURIComponent(cnpj);
    window.location.href = `agencia-guias.html?cnpj=${cnpjEncoded}&nome=${nomeEncoded}`;
}

function alterarStatus(cnpj, novoStatus) {
  const agencia = allAgencias.find(a => a.cnpj === cnpj);
  if(agencia && confirm(`Deseja alterar o status para ${novoStatus.toUpperCase()}?`)) {
      agencia.status = novoStatus;
      applyFilters(); 
      alert("Status atualizado!");
  }
}

function applyFilters() {
  const status = document.getElementById("filterStatus")?.value.toLowerCase().trim();
  const search = document.getElementById("searchAgencia")?.value.toLowerCase().trim();

  filteredAgencias = allAgencias.filter(a => {
    const matchStatus = !status || a.status.toLowerCase() === status;
    const matchSearch = !search || a.nome_fantasia.toLowerCase().includes(search) || a.cnpj.includes(search);
    return matchStatus && matchSearch;
  });

  renderAgencias(filteredAgencias);
  updateMetrics();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("btnSearch")?.addEventListener("click", applyFilters);
  document.getElementById("searchAgencia")?.addEventListener("keypress", (e) => { if (e.key === "Enter") applyFilters(); });
  document.getElementById("filterStatus")?.addEventListener("change", applyFilters);
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    document.getElementById("searchAgencia").value = "";
    document.getElementById("filterStatus").value = "";
    applyFilters();
  });

  renderAgencias(allAgencias);
  updateMetrics();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario && usuario.email) {
    const adminEmail = document.getElementById('adminEmail');
    if(adminEmail) adminEmail.textContent = usuario.email;
  }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../../index.html';
  });
}