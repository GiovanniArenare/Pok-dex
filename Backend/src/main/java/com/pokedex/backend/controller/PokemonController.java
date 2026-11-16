
package com.pokedex.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pokedex.backend.model.Pokemon;
import com.pokedex.backend.service.PokemonService;
import com.pokedex.backend.service.PokemonIdService;

@RestController
@RequestMapping("/api/pokemons")
@CrossOrigin(origins = "http://localhost:5173")
public class PokemonController {

    private final PokemonService pokemonService;
    private final PokemonIdService pokemonIdService;

    public PokemonController(
            PokemonService pokemonService,
            PokemonIdService pokemonIdService) {

        this.pokemonService = pokemonService;
        this.pokemonIdService = pokemonIdService;
    }

    @GetMapping
    public List<Pokemon> listarTodos() {
        return pokemonService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pokemon> buscarPorId(@PathVariable Integer id) {
        return pokemonService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pokemon> cadastrar(@RequestBody Pokemon pokemon) {

        Integer novoId = pokemonIdService.gerarProximoId();

        pokemon.setId(novoId);

        Pokemon salvo = pokemonService.salvar(pokemon);

        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pokemon> atualizar(
            @PathVariable Integer id,
            @RequestBody Pokemon pokemon) {

        if (!pokemonService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        pokemon.setId(id);

        Pokemon atualizado = pokemonService.salvar(pokemon);

        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {

        if (!pokemonService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        pokemonService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
