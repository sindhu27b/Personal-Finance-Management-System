package org.project.fintrack.controllers;

import jakarta.validation.Valid;
import org.project.fintrack.dtos.AuthDtos.*;

import org.project.fintrack.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiMessageResponse> register(@Valid @RequestBody RegisterRequest req) {
        boolean created = auth.register(req.name, req.email, req.password);
        if (!created) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiMessageResponse(409, "Email already in use."));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiMessageResponse(201, "Registration successful."));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        String token = auth.login(req.email, req.password);
        return ResponseEntity.ok(new LoginResponse(200, "Login successful.", token));
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

}