package org.project.fintrack.security.exceptionHandlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException ex) throws IOException {
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.setContentType("application/json");
        mapper.writeValue(res.getOutputStream(), Map.of(
                "status", 401,
                "error", "Unauthorized",
                "code", "UNAUTHORIZED",
                "message", "Authentication required",
                "path", req.getRequestURI(),
                "traceId", UUID.randomUUID().toString()
        ));
    }
}