package com.pokedex.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pokedex.backend.model.Pokemon;
import com.pokedex.backend.repository.PokemonRepository;

@Service
public class PokemonService {

    private final PokemonRepository pokemonRepository;

    public PokemonService(PokemonRepository pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    public List<Pokemon> listarTodos() {
        return pokemonRepository.findAll();
    }

    public Optional<Pokemon> buscarPorId(Integer id) {
        return pokemonRepository.findById(id);
    }

    public Pokemon salvar(Pokemon pokemon) {
        return pokemonRepository.save(pokemon);
    }

    public void excluir(Integer id) {
        pokemonRepository.deleteById(id);
    }

    public boolean existePorId(Integer id) {
        return pokemonRepository.existsById(id);
    }
}
