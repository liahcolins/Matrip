package br.com.suaapi.controller;

import br.com.suaapi.dto.UserProfileResponse;
import br.com.suaapi.model.Usuario;
import br.com.suaapi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UsuarioRepository repository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        // Pega o e-mail do usuário logado através do token JWT que passou pelo filtro
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Usuario user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .cpf(user.getCpf())
                .contato(user.getContato())
                .tipo(user.getTipo())
                .build();
                
        return ResponseEntity.ok(response);
    }
}
