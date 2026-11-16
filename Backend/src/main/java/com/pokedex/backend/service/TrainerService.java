
package com.pokedex.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pokedex.backend.model.Trainer;
import com.pokedex.backend.repository.TrainerRepository;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;

    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    public List<Trainer> listarTodos() {
        return trainerRepository.findAll();
    }

    public Optional<Trainer> buscarPorId(Integer id) {
        return trainerRepository.findById(id);
    }

    public Trainer salvar(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    public void excluir(Integer id) {
        trainerRepository.deleteById(id);
    }

    public boolean existePorId(Integer id) {
        return trainerRepository.existsById(id);
    }
}
