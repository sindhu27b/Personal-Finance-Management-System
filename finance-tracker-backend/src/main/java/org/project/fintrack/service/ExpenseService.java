package org.project.fintrack.service;

import org.project.fintrack.exceptions.ForbiddenException;
import org.project.fintrack.exceptions.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.project.fintrack.entity.Expense;
import org.project.fintrack.entity.User;
import org.project.fintrack.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ExpenseService {
    private final ExpenseRepository repo;

    public ExpenseService(ExpenseRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Expense> list(User user) {
        return repo.findByUserOrderByDateDesc(user);
    }

    public Expense create(User user, Expense e) {
        e.setUser(user);
        return repo.save(e);
    }

    public Expense update(User user, Long id, Expense payload) {
        Expense e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        if (!e.getUser().getId().equals(user.getId())) throw new ForbiddenException("You do not own this expense");
        e.setAmount(payload.getAmount());
        e.setCategory(payload.getCategory());
        e.setDate(payload.getDate());
        e.setDescription(payload.getDescription());
        return repo.save(e);
    }

    public Expense delete(User user, Long id) {
        Expense e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        if (!e.getUser().getId().equals(user.getId())) throw new ForbiddenException("You do not own this expense");
        repo.delete(e);
        return e;
    }
}