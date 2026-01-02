package org.project.fintrack.controllers;


import jakarta.validation.Valid;
import org.project.fintrack.entity.Investment;
import org.project.fintrack.repository.UserRepository;
import org.project.fintrack.service.InvestmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "*")
public class InvestmentController extends BaseController {

    private final InvestmentService service;

    public InvestmentController(UserRepository users, InvestmentService service) {
        super(users);
        this.service = service;
    }

    @GetMapping
    public List<Investment> list() {
        return service.list(currentUser());
    }

    @PostMapping
    public ResponseEntity<Investment> create(@Valid @RequestBody Investment inv) {
        Investment saved = service.create(currentUser(), inv);
        return ResponseEntity.created(URI.create("/api/investments/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public Investment update(@PathVariable Long id, @Valid @RequestBody Investment payload) {
        return service.update(currentUser(), id, payload);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Investment> delete(@PathVariable Long id) {
        Investment deleted = service.delete(currentUser(), id);
        return ResponseEntity.ok(deleted);
    }
}
