package org.project.fintrack.controllers;


import org.project.fintrack.entity.User;
import org.project.fintrack.exceptions.ApiException;
import org.project.fintrack.exceptions.ResourceNotFoundException;
import org.project.fintrack.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class BaseController {
    private final UserRepository users;

    protected BaseController(UserRepository users) { this.users = users; }

    protected User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required");
        }
        String email = auth.getName(); // set by JwtAuthFilter
        return users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }
}