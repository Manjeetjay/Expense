package com.backend.repository;

import com.backend.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Page<Expense> findAllByDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    @Query("SELECT SUM(e.amount) FROM Expense e")
    Double getTotalExpenses();
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.date BETWEEN ?1 AND ?2")
    Double getTotalExpensesBetween(LocalDateTime start, LocalDateTime end);
} 