package org.project.fintrack.service;

import org.project.fintrack.exceptions.ForbiddenException;
import org.project.fintrack.exceptions.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.project.fintrack.entity.Income;
import org.project.fintrack.entity.User;
import org.project.fintrack.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class IncomeService {
    private final IncomeRepository repo;

    public IncomeService(IncomeRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Income> list(User user) {
        return repo.findByUserOrderByDateDesc(user);
    }

    public Income create(User user, Income i) {
        i.setUser(user);
        return repo.save(i);
    }

    public Income update(User user, Long id, Income payload) {
        Income e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Income", id));
        if (!e.getUser().getId().equals(user.getId())) throw new ForbiddenException("You do not own this income item");
        e.setAmount(payload.getAmount());
        e.setSource(payload.getSource());
        e.setDate(payload.getDate());
        e.setDescription(payload.getDescription());
        return repo.save(e);
    }

    public Income delete(User user, Long id) {
        Income e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Income", id));
        if (!e.getUser().getId().equals(user.getId())) throw new ForbiddenException("You do not own this income item");
        repo.delete(e);
        return e;
    }
}