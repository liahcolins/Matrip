package br.com.suaapi.service;

import br.com.suaapi.dto.AuthRequest;
import br.com.suaapi.dto.AuthResponse;
import br.com.suaapi.dto.RegisterRequest;
import br.com.suaapi.model.Usuario;
import br.com.suaapi.repository.UsuarioRepository;
import br.com.suaapi.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já está em uso.");
        }
        if (request.getCpf() != null && !request.getCpf().isEmpty() && repository.existsByCpf(request.getCpf())) {
            throw new RuntimeException("CPF já está em uso.");
        }

        var user = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .cpf(request.getCpf())
                .contato(request.getContato())
                .senha(passwordEncoder.encode(request.getSenha()))
                .tipo("usuario")
                .build();
        
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .nome(user.getNome())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );
        
        var user = repository.findByEmail(request.getEmail())
                .orElseGet(() -> repository.findByCpf(request.getEmail()).orElseThrow());
        
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .nome(user.getNome())
                .email(user.getEmail())
                .build();
    }
}
