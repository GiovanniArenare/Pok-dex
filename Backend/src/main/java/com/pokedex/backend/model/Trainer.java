
package com.pokedex.backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "trainers")
public class Trainer {

    @Id
    private Integer id;

    private String name;
    private Integer badges;
    private List<Integer> pokemonIds;

    public Trainer() {
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

    public Integer getBadges() {
        return badges;
    }

    public void setBadges(Integer badges) {
        this.badges = badges;
    }

    public List<Integer> getPokemonIds() {
        return pokemonIds;
    }

    public void setPokemonIds(List<Integer> pokemonIds) {
        this.pokemonIds = pokemonIds;
    }
}
