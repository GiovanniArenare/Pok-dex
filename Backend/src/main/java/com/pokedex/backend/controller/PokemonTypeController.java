package com.pokedex.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pokedex.backend.model.PokemonType;
import com.pokedex.backend.service.PokemonTypeService;

@RestController
@RequestMapping("/api/types")
@CrossOrigin(origins = "http://localhost:5173")
public class PokemonTypeController {

    private final PokemonTypeService pokemonTypeService;

    public PokemonTypeController(PokemonTypeService pokemonTypeService) {
        this.pokemonTypeService = pokemonTypeService;
    }

    @GetMapping
    public List<PokemonType> listarTodos() {
        return pokemonTypeService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PokemonType> buscarPorId(@PathVariable Integer id) {
        return pokemonTypeService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PokemonType> cadastrar(@RequestBody PokemonType pokemonType) {

        if (pokemonType.getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (pokemonTypeService.existePorId(pokemonType.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        PokemonType salvo = pokemonTypeService.salvar(pokemonType);

        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PokemonType> atualizar(
            @PathVariable Integer id,
            @RequestBody PokemonType pokemonType) {

        if (!pokemonTypeService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        pokemonType.setId(id);

        PokemonType atualizado = pokemonTypeService.salvar(pokemonType);

        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {

        if (!pokemonTypeService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        pokemonTypeService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
