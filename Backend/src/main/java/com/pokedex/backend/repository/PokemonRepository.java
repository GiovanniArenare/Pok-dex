package com.pokedex.backend.repository;

import com.pokedex.backend.model.Pokemon;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
}
