package org.project.fintrack.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.project.fintrack.entity.Income;
import org.project.fintrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserOrderByDateDesc(User user);

    @Query("SELECT COALESCE(SUM(i.amount),0) FROM Income i WHERE i.user = :user AND i.date BETWEEN :start AND :end")
    BigDecimal sumByUserAndDateBetween(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(i.amount),0) FROM Income i WHERE i.user = :user")
    BigDecimal sumByUser(@Param("user") User user);
}