package org.project.fintrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    // Store a bcrypt hash here (we’ll add auth later)
    @Column(nullable = false)
    private String passwordHash;

    private Instant createdAt = Instant.now();
}