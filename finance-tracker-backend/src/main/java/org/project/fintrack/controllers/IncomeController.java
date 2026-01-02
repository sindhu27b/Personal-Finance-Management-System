package org.project.fintrack.controllers;

import jakarta.validation.Valid;
import org.project.fintrack.entity.Income;
import org.project.fintrack.repository.IncomeRepository;
import org.project.fintrack.repository.UserRepository;
import org.project.fintrack.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "*")
public class IncomeController extends BaseController {

    private final IncomeService service;

    public IncomeController(UserRepository users, IncomeService service) {
        super(users);
        this.service = service;
    }

    @GetMapping
    public List<Income> list() {
        return service.list(currentUser());
    }

    @PostMapping
    public ResponseEntity<Income> create(@Valid @RequestBody Income income) {
        Income saved = service.create(currentUser(), income);
        return ResponseEntity.created(URI.create("/api/income/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public Income update(@PathVariable Long id, @Valid @RequestBody Income payload) {
        return service.update(currentUser(), id, payload);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Income> delete(@PathVariable Long id) {
        Income deleted = service.delete(currentUser(), id);
        return ResponseEntity.ok(deleted);
    }
}