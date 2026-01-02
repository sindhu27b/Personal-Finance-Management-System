package org.project.fintrack.service;

import org.springframework.transaction.annotation.Transactional;
import org.project.fintrack.entity.User;
import org.project.fintrack.repository.ExpenseRepository;
import org.project.fintrack.repository.IncomeRepository;
import org.project.fintrack.repository.InvestmentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ReportService {
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final InvestmentRepository investmentRepository;

    public ReportService(ExpenseRepository expenseRepository,
                         IncomeRepository incomeRepository,
                         InvestmentRepository investmentRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.investmentRepository = investmentRepository;
    }

    public Map<String, Object> summary(User user, LocalDate start, LocalDate end) {
        BigDecimal income = incomeRepository.sumByUserAndDateBetween(user, start, end);
        BigDecimal expenses = expenseRepository.sumByUserAndDateBetween(user, start, end);
        BigDecimal invValue = investmentRepository.totalCurrentValue(user);

        Map<String, Object> period = new HashMap<>();
        period.put("start", start.toString());
        period.put("end", end.toString());

        Map<String, Object> resp = new HashMap<>();
        resp.put("income", income);
        resp.put("expenses", expenses);
        resp.put("net", income.subtract(expenses));
        resp.put("investmentValue", invValue);
        resp.put("period", period);
        return resp;

    }
}