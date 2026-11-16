package com.pokedex.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pokedex.backend.model.Trainer;

public interface TrainerRepository extends MongoRepository<Trainer, Integer> {

}
