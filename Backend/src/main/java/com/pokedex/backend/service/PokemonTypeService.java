package com.pokedex.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pokedex.backend.model.PokemonType;
import com.pokedex.backend.repository.PokemonTypeRepository;

@Service
public class PokemonTypeService {

    private final PokemonTypeRepository pokemonTypeRepository;

    public PokemonTypeService(PokemonTypeRepository pokemonTypeRepository) {
        this.pokemonTypeRepository = pokemonTypeRepository;
    }

    public List<PokemonType> listarTodos() {
        return pokemonTypeRepository.findAll();
    }

    public Optional<PokemonType> buscarPorId(Integer id) {
        return pokemonTypeRepository.findById(id);
    }

    public PokemonType salvar(PokemonType pokemonType) {
        return pokemonTypeRepository.save(pokemonType);
    }

    public void excluir(Integer id) {
        pokemonTypeRepository.deleteById(id);
    }

    public boolean existePorId(Integer id) {
        return pokemonTypeRepository.existsById(id);
    }
}
