document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebarClose");

  console.log("sidebar.js carregado");

  // abrir sidebar
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  }

  // fechar sidebar pelo botão X
  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  // fechar sidebar clicando fora (mobile)
  document.addEventListener("click", (event) => {

    const isMobile = window.innerWidth <= 768;

    if (!isMobile || !sidebar) return;

    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedMenuButton = menuToggle && menuToggle.contains(event.target);

    if (!clickedInsideSidebar && !clickedMenuButton) {
      sidebar.classList.remove("open");
    }

  });

  // BOTÃO SAIR
  document.addEventListener("click", function (e) {

    const btnSair = e.target.closest(".logout-btn");

    if (!btnSair) return;

    e.preventDefault();

    console.log("Logout acionado");

    // limpar sessão
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    localStorage.removeItem("redirectAfterLogin");

    // redirecionar
    window.location.href = "http://localhost:3000/";

  });

});