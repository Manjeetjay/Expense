package com.backend.repository;

import com.backend.model.MonthlyBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.YearMonth;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, Long> {
    @Query("SELECT mb FROM MonthlyBudget mb WHERE mb.yearMonth = :yearMonth")
    Optional<MonthlyBudget> findByYearMonth(String yearMonth);

    default Optional<MonthlyBudget> findByYearMonth(YearMonth yearMonth) {
        return findByYearMonth(yearMonth.toString());
    }

    @Query("SELECT SUM(mb.amount) FROM MonthlyBudget mb")
    Double getTotalBudget();
} 