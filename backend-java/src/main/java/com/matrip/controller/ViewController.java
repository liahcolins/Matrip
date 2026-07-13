package com.matrip.controller;

import com.matrip.entity.*;
import com.matrip.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;

@Controller
public class ViewController {

    @Autowired
    private PasseioRepository passeioRepository;

    @Autowired
    private AgenciaRepository agenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PasseioImagemRepository passeioImagemRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    // ==========================================
    // IMAGENS AUXILIARES E JSON PARSERS
    // ==========================================
    private void popularImagensPasseio(Passeio p) {
        List<PasseioImagem> imgs = passeioImagemRepository.findByPasseioIdOrderByIdAsc(p.getId());
        if (!imgs.isEmpty()) {
            p.setImagem(imgs.get(0).getCaminho());
            List<String> caminhos = new ArrayList<>();
            for (PasseioImagem img : imgs) {
                caminhos.add(img.getCaminho());
            }
            p.setImagens(caminhos);
        }
    }

    private void popularImagensListaPasseios(List<Passeio> list) {
        for (Passeio p : list) {
            popularImagensPasseio(p);
        }
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
        } catch (Exception e) {
            if (json.contains("\n")) {
                return Arrays.asList(json.split("\n"));
            } else if (json.contains(";")) {
                return Arrays.asList(json.split(";"));
            }
            return Collections.singletonList(json);
        }
    }

    private List<String> formatRoteiro(String json) {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            Map<String, Object> map = objectMapper.readValue(json, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
            List<String> lines = new ArrayList<>();
            
            // Saida
            Map<String, Object> saida = (Map<String, Object>) map.get("saida");
            if (saida != null) {
                String hora = (String) saida.get("hora");
                String local = (String) saida.get("local");
                if (hora != null || local != null) {
                    lines.add("Saída: " + (hora != null ? hora : "") + (local != null ? " — " + local : ""));
                }
            }
            
            // Paradas
            List<Map<String, Object>> paradas = (List<Map<String, Object>>) map.get("paradas");
            if (paradas != null) {
                int count = 1;
                for (Map<String, Object> p : paradas) {
                    String hora = (String) p.get("hora");
                    String local = (String) p.get("local");
                    if (hora != null || local != null) {
                        lines.add("Parada " + count++ + ": " + (hora != null ? hora : "") + (local != null ? " — " + local : ""));
                    }
                }
            }
            
            // Retorno
            Map<String, Object> retorno = (Map<String, Object>) map.get("retorno");
            if (retorno != null) {
                String hora = (String) retorno.get("hora");
                String local = (String) retorno.get("local");
                if (hora != null || local != null) {
                    lines.add("Retorno: " + (hora != null ? hora : "") + (local != null ? " — " + local : ""));
                }
            }
            return lines;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    // ==========================================
    // SESSÃO E CONTEXTO GERAL
    // ==========================================
    private Usuario getUsuarioLogado(HttpSession session) {
        return (Usuario) session.getAttribute("usuario");
    }

    private void popularModelUsuario(Model model, HttpSession session) {
        Usuario usuario = getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuario);
        model.addAttribute("isLoggedIn", usuario != null);
        if (usuario != null) {
            model.addAttribute("usuarioTipo", usuario.getTipo());
            model.addAttribute("usuarioNome", usuario.getNome());
        }
    }

    // ==========================================
    // ROTA RAIZ / INDEX
    // ==========================================
    @GetMapping({"/", "/index", "/index.html"})
    public String index(Model model, HttpSession session) {
        popularModelUsuario(model, session);
        
        // Carregar passeios e parceiros
        List<Passeio> passeios = passeioRepository.findAllByOrderByCategoriaAscIdDesc();
        popularImagensListaPasseios(passeios);

        // Agrupar passeios por categoria
        Map<String, List<Passeio>> categorias = new LinkedHashMap<>();
        for (Passeio p : passeios) {
            String cat = p.getCategoria() != null ? p.getCategoria().trim() : "Outros";
            categorias.computeIfAbsent(cat, k -> new ArrayList<>()).add(p);
        }
        
        List<Agencia> agencias = agenciaRepository.findByStatusOrderByCreatedAtDesc("ativa");
        
        model.addAttribute("passeios", passeios);
        model.addAttribute("categorias", categorias);
        model.addAttribute("parceiros", agencias);
        
        return "index";
    }

    // ==========================================
    // DETALHES DO PASSEIO
    // ==========================================
    @GetMapping({"/paginas/Detalhes.html", "/paginas/Detalhes"})
    public String detalhesPasseio(@RequestParam(required = false) Integer id, Model model, HttpSession session) {
        popularModelUsuario(model, session);
        
        if (id == null) {
            return "redirect:/";
        }
        
        Optional<Passeio> optPasseio = passeioRepository.findById(id);
        if (optPasseio.isEmpty()) {
            return "redirect:/";
        }
        
        Passeio passeio = optPasseio.get();
        popularImagensPasseio(passeio);
        model.addAttribute("passeio", passeio);
        
        // Obter nome do guia
        if (passeio.getGuia() != null) {
            model.addAttribute("guiaNome", passeio.getGuia().getNome());
        }
        
        // Mapear colunas JSON
        model.addAttribute("roteiroList", formatRoteiro(passeio.getRoteiro()));
        model.addAttribute("incluiList", parseJsonList(passeio.getInclui()));
        model.addAttribute("embarqueList", parseJsonList(passeio.getLocaisEmbarque()));
        model.addAttribute("importantesList", parseJsonList(passeio.getInformacoesImportantes()));
        
        return "paginas/Detalhes";
    }

    // ==========================================
    // AUTHENTICATION (LOGIN & CADASTRO)
    // ==========================================
    @GetMapping({"/paginas/login1.html", "/paginas/login1"})
    public String loginPage(Model model, HttpSession session,
                            @RequestParam(required = false) String error,
                            @RequestParam(required = false) String success) {
        popularModelUsuario(model, session);
        if (getUsuarioLogado(session) != null) {
            return "redirect:/";
        }
        model.addAttribute("error", error);
        model.addAttribute("success", success);
        return "paginas/login1";
    }

    @PostMapping("/web/login")
    public String processLogin(@RequestParam String email, 
                               @RequestParam String password, 
                               HttpSession session, 
                               RedirectAttributes redirectAttributes) {
        
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);
        if (optUsuario.isEmpty()) {
            redirectAttributes.addAttribute("error", "invalid");
            return "redirect:/paginas/login1.html";
        }

        Usuario usuario = optUsuario.get();
        if (usuario.getSenha() == null || !passwordEncoder.matches(password, usuario.getSenha())) {
            redirectAttributes.addAttribute("error", "invalid");
            return "redirect:/paginas/login1.html";
        }

        // Login com sucesso -> Salvar na Session
        session.setAttribute("usuario", usuario);
        session.setAttribute("tipo", usuario.getTipo());

        String tipo = usuario.getTipo().toLowerCase();
        if ("admin".equals(tipo)) {
            return "redirect:/paginas/admin/index.html";
        } else if ("parceiro".equals(tipo)) {
            return "redirect:/paginas/parceiro/index.html";
        } else if ("guia".equals(tipo)) {
            return "redirect:/paginas/guia/index.html";
        } else {
            return "redirect:/index.html";
        }
    }

    @GetMapping({"/paginas/cadastro.html", "/paginas/cadastro"})
    public String cadastroPage(Model model, HttpSession session,
                               @RequestParam(required = false) String error) {
        popularModelUsuario(model, session);
        if (getUsuarioLogado(session) != null) {
            return "redirect:/";
        }
        model.addAttribute("error", error);
        return "paginas/cadastro";
    }

    @PostMapping("/web/cadastro")
    public String processCadastro(@RequestParam String nome,
                                 @RequestParam String email,
                                 @RequestParam String senha,
                                 RedirectAttributes redirectAttributes) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(email);
        if (existente.isPresent()) {
            redirectAttributes.addAttribute("error", "duplicate");
            return "redirect:/paginas/cadastro.html";
        }

        try {
            String senhaHash = passwordEncoder.encode(senha);
            Usuario usuario = new Usuario(nome, email, senhaHash, "usuario");
            usuarioRepository.save(usuario);
            redirectAttributes.addAttribute("success", "registered");
            return "redirect:/paginas/login1.html";
        } catch (Exception e) {
            redirectAttributes.addAttribute("error", "failed");
            return "redirect:/paginas/cadastro.html";
        }
    }

    @GetMapping("/logout")
    public String processLogout(HttpSession session) {
        session.invalidate();
        return "redirect:/index.html";
    }

    // ==========================================
    // DASHBOARD ADMINISTRADOR
    // ==========================================
    @GetMapping({"/paginas/admin/index.html", "/paginas/admin/index"})
    public String adminDashboard(Model model, HttpSession session) {
        popularModelUsuario(model, session);
        Usuario logado = getUsuarioLogado(session);
        if (logado == null || !"admin".equalsIgnoreCase(logado.getTipo())) {
            return "redirect:/paginas/login1.html";
        }
        return "paginas/admin/index";
    }

    @GetMapping("/paginas/admin/gerenciar-usuarios.html")
    public String gerenciarUsuarios(Model model, HttpSession session) {
        popularModelUsuario(model, session);
        Usuario logado = getUsuarioLogado(session);
        if (logado == null || !"admin".equalsIgnoreCase(logado.getTipo())) {
            return "redirect:/paginas/login1.html";
        }
        // Carrega todos exceto admin
        List<Usuario> usuarios = usuarioRepository.findByTipoNot("admin");
        model.addAttribute("usuarios", usuarios);
        return "paginas/admin/gerenciar-usuarios";
    }

    @PostMapping("/paginas/admin/usuarios/{id}/tipo")
    public String atualizarTipoUsuario(@PathVariable Integer id, @RequestParam String tipo, HttpSession session) {
        Usuario logado = getUsuarioLogado(session);
        if (logado != null && "admin".equalsIgnoreCase(logado.getTipo())) {
            usuarioRepository.findById(id).ifPresent(u -> {
                u.setTipo(tipo);
                usuarioRepository.save(u);
            });
        }
        return "redirect:/paginas/admin/gerenciar-usuarios.html";
    }

    // ==========================================
    // RECUPERAR SENHA
    // ==========================================
    @GetMapping({"/paginas/recuperar-senha.html", "/paginas/recuperar-senha"})
    public String recuperarSenhaPage(Model model, HttpSession session,
                                     @RequestParam(required = false) String success) {
        popularModelUsuario(model, session);
        model.addAttribute("success", success);
        return "paginas/recuperar-senha";
    }

    @PostMapping("/web/recuperar-senha")
    public String processRecuperarSenha(@RequestParam String email, RedirectAttributes redirectAttributes) {
        // Apenas simula o envio do link de recuperação
        redirectAttributes.addAttribute("success", "sent");
        return "redirect:/paginas/recuperar-senha.html";
    }

    // ==========================================
    // CONTROLE DE CARRINHO (SESSION)
    // ==========================================
    @PostMapping("/carrinho/adicionar")
    public String adicionarAoCarrinho(@RequestParam Integer id, HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute("cart", cart);
        }

        boolean found = false;
        for (CartItem item : cart) {
            if (item.getId().equals(id)) {
                item.setQuantidade(item.getQuantidade() + 1);
                found = true;
                break;
            }
        }

        if (!found) {
            Optional<Passeio> opt = passeioRepository.findById(id);
            if (opt.isPresent()) {
                Passeio p = opt.get();
                popularImagensPasseio(p);
                
                CartItem item = new CartItem();
                item.setId(p.getId());
                item.setTitulo(p.getLocal());
                item.setPreco(p.getValorFinal());
                item.setImagem(p.getImagem());
                item.setQuantidade(1);
                cart.add(item);
            }
        }

        return "redirect:/paginas/carrinho.html";
    }

    @PostMapping("/carrinho/remover")
    public String removerDoCarrinho(@RequestParam Integer id, HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart != null) {
            cart.removeIf(item -> item.getId().equals(id));
        }
        return "redirect:/paginas/carrinho.html";
    }

    @GetMapping("/paginas/carrinho.html")
    public String serveCarrinho(Model model, HttpSession session) {
        popularModelUsuario(model, session);
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null) {
            cart = Collections.emptyList();
        }
        model.addAttribute("cart", cart);

        // Calcular total
        java.math.BigDecimal total = java.math.BigDecimal.ZERO;
        for (CartItem item : cart) {
            if (item.getPreco() != null) {
                total = total.add(item.getPreco().multiply(new java.math.BigDecimal(item.getQuantidade())));
            }
        }
        model.addAttribute("total", total);

        return "paginas/carrinho";
    }

    // ==========================================
    // ROTAS FALLBACK E OUTRAS PÁGINAS DIVERSAS
    // ==========================================
    @GetMapping("/paginas/{page}.html")
    public String servePaginas(@PathVariable String page, Model model, HttpSession session) {
        popularModelUsuario(model, session);
        return "paginas/" + page;
    }

    @GetMapping("/paginas/{folder}/{page}.html")
    public String serveFolderPages(@PathVariable String folder, @PathVariable String page, Model model, HttpSession session) {
        popularModelUsuario(model, session);
        
        // Proteção simples de rotas baseado no tipo do usuário
        Usuario logado = getUsuarioLogado(session);
        if (logado == null) {
            return "redirect:/paginas/login1.html";
        }
        
        String tipo = logado.getTipo().toLowerCase();
        if (!tipo.equals(folder) && !"admin".equals(tipo)) {
            return "redirect:/index.html";
        }

        // Lógicas específicas de preenchimento para as dashboards de guia e parceiro
        if ("guia".equals(folder) && "meus-passeios".equals(page)) {
            List<Passeio> list = passeioRepository.findByGuiaIdOrderByIdDesc(logado.getId());
            popularImagensListaPasseios(list);
            model.addAttribute("passeios", list);
        } else if ("guia".equals(folder) && "servicos".equals(page)) {
            model.addAttribute("servicos", servicoRepository.findAll());
        } else if ("parceiro".equals(folder) && "meus-passeios".equals(page)) {
            List<Passeio> list = passeioRepository.findAll();
            popularImagensListaPasseios(list);
            model.addAttribute("passeios", list);
        }
        
        return "paginas/" + folder + "/" + page;
    }

    // DTO do Carrinho
    public static class CartItem {
        private Integer id;
        private String titulo;
        private java.math.BigDecimal preco;
        private String imagem;
        private Integer quantidade;

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }
        public java.math.BigDecimal getPreco() { return preco; }
        public void setPreco(java.math.BigDecimal preco) { this.preco = preco; }
        public String getImagem() { return imagem; }
        public void setImagem(String imagem) { this.imagem = imagem; }
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    }
}
