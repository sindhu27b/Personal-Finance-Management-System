package org.project.fintrack.service;

import org.project.fintrack.entity.User;
import org.project.fintrack.exceptions.ApiException;
import org.project.fintrack.repository.UserRepository;
import org.project.fintrack.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwt;

    public AuthService(UserRepository users,
                       PasswordEncoder encoder,
                       AuthenticationManager authManager,
                       JwtTokenProvider jwt) {
        this.users = users;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwt = jwt;
    }

    /**
     * Registers a new user.
     * @return true if created, false if email already exists.
     */
    @Transactional
    public boolean register(String name, String email, String rawPassword) {
        if (users.existsByEmail(email)) {
            return false;
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(rawPassword));
        users.save(u);
        return true;
    }

    /**
     * Authenticates credentials and returns a JWT on success.
     * Throws AuthenticationException on invalid credentials (handled as 401).
     */
    public String login(String email, String rawPassword) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(email, rawPassword));
            return jwt.generateToken(email);
        } catch (AuthenticationException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
        }
    }
}