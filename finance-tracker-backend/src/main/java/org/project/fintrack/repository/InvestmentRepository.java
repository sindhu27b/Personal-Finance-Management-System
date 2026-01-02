package org.project.fintrack.repository;

import java.math.BigDecimal;
import java.util.List;

import org.project.fintrack.entity.Investment;
import org.project.fintrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT COALESCE(SUM(inv.currentPrice * inv.quantity),0) FROM Investment inv WHERE inv.user = :user")
    BigDecimal totalCurrentValue(@Param("user") User user);
}