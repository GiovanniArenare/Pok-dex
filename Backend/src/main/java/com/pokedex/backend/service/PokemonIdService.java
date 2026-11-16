
package com.pokedex.backend.service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import org.bson.Document;

@Service
public class PokemonIdService {

    private final MongoTemplate mongoTemplate;

    public PokemonIdService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Integer gerarProximoId() {

        Query query = new Query(
            Criteria.where("_id").is("pokemon")
        );

        Update update = new Update().inc("sequencia", 1);

        FindAndModifyOptions options = new FindAndModifyOptions()
            .returnNew(true)
            .upsert(true);

        Document contador = mongoTemplate.findAndModify(
            query,
            update,
            options,
            Document.class,
            "counters"
        );

        return contador.getInteger("sequencia");
    }
}
