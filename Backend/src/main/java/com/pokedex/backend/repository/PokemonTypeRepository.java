package com.pokedex.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pokedex.backend.model.PokemonType;

public interface PokemonTypeRepository extends MongoRepository<PokemonType, Integer> {

}
