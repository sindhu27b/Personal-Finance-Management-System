package org.project.fintrack.security.exceptionHandlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException ex) throws IOException {
        res.setStatus(HttpStatus.FORBIDDEN.value());
        res.setContentType("application/json");
        mapper.writeValue(res.getOutputStream(), Map.of(
                "status", 403,
                "error", "Forbidden",
                "code", "FORBIDDEN",
                "message", "Access denied",
                "path", req.getRequestURI(),
                "traceId", UUID.randomUUID().toString()
        ));
    }
}