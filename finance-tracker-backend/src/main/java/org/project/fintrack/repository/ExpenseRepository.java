package org.project.fintrack.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.project.fintrack.entity.Expense;
import org.project.fintrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDesc(User user);

    @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end")
    BigDecimal sumByUserAndDateBetween(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e WHERE e.user = :user")
    BigDecimal sumByUser(@Param("user") User user);
}