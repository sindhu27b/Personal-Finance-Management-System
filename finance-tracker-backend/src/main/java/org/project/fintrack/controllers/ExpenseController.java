package org.project.fintrack.controllers;

import jakarta.validation.Valid;
import org.project.fintrack.entity.Expense;
import org.project.fintrack.repository.UserRepository;
import org.project.fintrack.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController extends BaseController {

    private final ExpenseService service;

    public ExpenseController(UserRepository users, ExpenseService service) {
        super(users);
        this.service = service;
    }

    @GetMapping
    public List<Expense> list() {
        return service.list(currentUser());
    }

    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody Expense expense) {
        Expense saved = service.create(currentUser(), expense);
        return ResponseEntity.created(URI.create("/api/expenses/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public Expense update(@PathVariable("id") Long id, @Valid @RequestBody Expense payload) {
        return service.update(currentUser(), id, payload);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Expense> delete(@PathVariable Long id) {
        Expense deleted = service.delete(currentUser(), id);
        return ResponseEntity.ok(deleted);
    }
}
