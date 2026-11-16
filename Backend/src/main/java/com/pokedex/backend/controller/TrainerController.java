
package com.pokedex.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pokedex.backend.model.Trainer;
import com.pokedex.backend.service.TrainerService;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @GetMapping
    public List<Trainer> listarTodos() {
        return trainerService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> buscarPorId(@PathVariable Integer id) {
        return trainerService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Trainer> cadastrar(@RequestBody Trainer trainer) {

        if (trainer.getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (trainerService.existePorId(trainer.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Trainer salvo = trainerService.salvar(trainer);

        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trainer> atualizar(
            @PathVariable Integer id,
            @RequestBody Trainer trainer) {

        if (!trainerService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        trainer.setId(id);

        Trainer atualizado = trainerService.salvar(trainer);

        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {

        if (!trainerService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        trainerService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
