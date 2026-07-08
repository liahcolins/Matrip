package com.matrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matrip.entity.Usuario;
import com.matrip.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class OAuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ==============================
    // GOOGLE OAUTH - INICIAR (REDIRECIONAR)
    // ==============================
    @GetMapping("/auth/google")
    public ResponseEntity<Void> authGoogle() {
        // Redireciona para o callback diretamente, simulando a resposta de sucesso
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "/auth/google/callback")
                .build();
    }

    // ==============================
    // GOOGLE OAUTH - CALLBACK
    // ==============================
    @GetMapping(value = "/auth/google/callback", produces = MediaType.TEXT_HTML_VALUE)
    public String authGoogleCallback() {
        try {
            // Busca um usuário comum ou admin para simular a resposta de login bem-sucedida
            List<Usuario> usuarios = usuarioRepository.findAll();
            Usuario mockUser = null;
            for (Usuario u : usuarios) {
                if ("usuario".equals(u.getTipo())) {
                    mockUser = u;
                    break;
                }
            }
            if (mockUser == null && !usuarios.isEmpty()) {
                mockUser = usuarios.get(0);
            }

            Map<String, Object> userMap = new HashMap<>();
            if (mockUser != null) {
                userMap.put("id", mockUser.getId());
                userMap.put("nome", mockUser.getNome());
                userMap.put("email", mockUser.getEmail());
                userMap.put("tipo", mockUser.getTipo());
            } else {
                // Caso não haja usuários no banco, simula um default
                userMap.put("id", 13);
                userMap.put("nome", "Sheila Mock");
                userMap.put("email", "sheila@email.com");
                userMap.put("tipo", "usuario");
            }

            String userJson = objectMapper.writeValueAsString(userMap);
            String userJsonEscaped = userJson.replace("<", "\\u003c");
            String tipo = (String) userMap.get("tipo");

            return """
                  <script>
                    localStorage.setItem("usuario", '%s');
                    localStorage.setItem("tipo", "%s");

                    const redirect = localStorage.getItem("redirectAfterLogin");
                    if (redirect) {
                      localStorage.removeItem("redirectAfterLogin");
                      window.location.replace(redirect);
                    } else {
                      window.location.replace("/paginas/dashboard.html");
                    }
                  </script>
                  """.formatted(userJsonEscaped, tipo);

        } catch (Exception e) {
            return "<h3>Erro ao processar login social: " + e.getMessage() + "</h3>";
        }
    }
}
