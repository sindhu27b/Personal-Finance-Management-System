package org.project.fintrack.service;


import org.project.fintrack.entity.Investment;
import org.project.fintrack.entity.User;
import org.project.fintrack.exceptions.ForbiddenException;
import org.project.fintrack.exceptions.ResourceNotFoundException;
import org.project.fintrack.repository.InvestmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InvestmentService {
    private final InvestmentRepository repo;

    public InvestmentService(InvestmentRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Investment> list(User user) {
        return repo.findByUserOrderByCreatedAtDesc(user);
    }

    public Investment create(User user, Investment inv) {
        inv.setUser(user);
        return repo.save(inv);
    }

    public Investment update(User user, Long id, Investment payload) {
        Investment e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Investment", id));
        if (!e.getUser().getId().equals(user.getId())) throw new ForbiddenException("You do not own this investment item");
        e.setAssetType(payload.getAssetType());
        e.setSymbol(payload.getSymbol());
        e.setQuantity(payload.getQuantity());
        e.setAvgBuyPrice(payload.getAvgBuyPrice());
        e.setCurrentPrice(payload.getCurrentPrice());
        return repo.save(e);
    }

    public Investment delete(User user, Long id) {
        Investment e = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Investment", id));
        if (!e.getUser().getId().equals(user.getId())) throw new ForbiddenException("You do not own this investment item");
        repo.delete(e);
        return e;
    }
}