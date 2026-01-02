package org.project.fintrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "income")
public class Income {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 500)
    private String description;
}
