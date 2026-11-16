
package com.pokedex.backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pokemons")
public class Pokemon {

    @Id
    private Integer id;

    private String name;
    private List<PokemonType> types;
    private PokemonStats stats;

    public Pokemon() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<PokemonType> getTypes() {
        return types;
    }

    public void setTypes(List<PokemonType> types) {
        this.types = types;
    }

    public PokemonStats getStats() {
        return stats;
    }

    public void setStats(PokemonStats stats) {
        this.stats = stats;
    }
}
