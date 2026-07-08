package com.matrip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/localidades")
@CrossOrigin(origins = "*")
public class LocalidadeController {

    private static final List<Map<String, Object>> paises = new CopyOnWriteArrayList<>();
    private static final List<Map<String, Object>> ufs = new CopyOnWriteArrayList<>();
    private static final List<Map<String, Object>> cidades = new CopyOnWriteArrayList<>();
    private static int nextPaisId = 1;
    private static int nextUfId = 1;
    private static int nextCidadeId = 1;

    static {
        // Inicializar dados padrão
        Map<String, Object> brasil = new HashMap<>();
        brasil.put("id", nextPaisId++);
        brasil.put("nome", "Brasil");
        paises.add(brasil);

        Map<String, Object> ma = new HashMap<>();
        ma.put("id", nextUfId++);
        ma.put("nome", "Maranhão");
        ma.put("sigla", "MA");
        ma.put("paisId", 1);
        ufs.add(ma);

        Map<String, Object> sl = new HashMap<>();
        sl.put("id", nextCidadeId++);
        sl.put("nome", "São Luís");
        sl.put("ufId", 1);
        cidades.add(sl);

        Map<String, Object> ba = new HashMap<>();
        ba.put("id", nextCidadeId++);
        ba.put("nome", "Barreirinhas");
        ba.put("ufId", 1);
        cidades.add(ba);
    }

    @GetMapping("/paises")
    public ResponseEntity<?> getPaises() {
        return ResponseEntity.ok(paises);
    }

    @PostMapping("/paises")
    public ResponseEntity<?> addPais(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome do país é obrigatório"));
        }
        Map<String, Object> p = new HashMap<>();
        p.put("id", nextPaisId++);
        p.put("nome", nome.trim());
        paises.add(p);
        return ResponseEntity.ok(p);
    }

    @GetMapping("/ufs/{paisId}")
    public ResponseEntity<?> getUfs(@PathVariable Integer paisId) {
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> uf : ufs) {
            if (Objects.equals(uf.get("paisId"), paisId)) {
                filtered.add(uf);
            }
        }
        return ResponseEntity.ok(filtered);
    }

    @PostMapping("/ufs")
    public ResponseEntity<?> addUf(@RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        String sigla = (String) body.get("sigla");
        Integer paisId = null;
        if (body.get("paisId") instanceof Number) {
            paisId = ((Number) body.get("paisId")).intValue();
        } else if (body.get("paisId") instanceof String) {
            paisId = Integer.parseInt((String) body.get("paisId"));
        }

        if (nome == null || nome.trim().isEmpty() || sigla == null || sigla.trim().isEmpty() || paisId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        Map<String, Object> uf = new HashMap<>();
        uf.put("id", nextUfId++);
        uf.put("nome", nome.trim());
        uf.put("sigla", sigla.trim().toUpperCase());
        uf.put("paisId", paisId);
        ufs.add(uf);
        return ResponseEntity.ok(uf);
    }

    @GetMapping("/cidades/{ufId}")
    public ResponseEntity<?> getCidades(@PathVariable Integer ufId) {
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> c : cidades) {
            if (Objects.equals(c.get("ufId"), ufId)) {
                filtered.add(c);
            }
        }
        return ResponseEntity.ok(filtered);
    }

    @PostMapping("/cidades")
    public ResponseEntity<?> addCidade(@RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        Integer ufId = null;
        if (body.get("ufId") instanceof Number) {
            ufId = ((Number) body.get("ufId")).intValue();
        } else if (body.get("ufId") instanceof String) {
            ufId = Integer.parseInt((String) body.get("ufId"));
        }

        if (nome == null || nome.trim().isEmpty() || ufId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        Map<String, Object> c = new HashMap<>();
        c.put("id", nextCidadeId++);
        c.put("nome", nome.trim());
        c.put("ufId", ufId);
        cidades.add(c);
        return ResponseEntity.ok(c);
    }
}
