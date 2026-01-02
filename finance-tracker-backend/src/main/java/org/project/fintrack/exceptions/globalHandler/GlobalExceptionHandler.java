package org.project.fintrack.exceptions.globalHandler;

import jakarta.servlet.http.HttpServletRequest;
import org.project.fintrack.exceptions.ApiException;
import org.project.fintrack.exceptions.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import org.springframework.security.core.AuthenticationException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<Object> build(HttpStatus status, String code, String message,
                                         String path, Map<String,Object> details, String traceId) {
        ErrorResponse body = new ErrorResponse()
                .status(status.value())
                .error(status.getReasonPhrase())
                .code(code)
                .message(message)
                .path(path)
                .traceId(traceId)
                .details(details);
        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Object> handleApi(ApiException ex, HttpServletRequest req) {
        String trace = UUID.randomUUID().toString();
        log.warn("API error [{}]: {}", trace, ex.getMessage());
        return build(ex.getStatus(), ex.getCode(), ex.getMessage(), req.getRequestURI(), null, trace);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Object> handleNoSuch(NoSuchElementException ex, HttpServletRequest req) {
        String trace = UUID.randomUUID().toString();
        return build(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage(), req.getRequestURI(), null, trace);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
        String trace = UUID.randomUUID().toString();
        log.warn("Data integrity [{}]: {}", trace, ex.getMostSpecificCause().getMessage());
        return build(HttpStatus.CONFLICT, "CONFLICT", "Data integrity violation", req.getRequestURI(), null, trace);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleDenied(AccessDeniedException ex, HttpServletRequest req) {
        String trace = UUID.randomUUID().toString();
        return build(HttpStatus.FORBIDDEN, "FORBIDDEN", "Access denied", req.getRequestURI(), null, trace);
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Object> handleAll(Exception ex, HttpServletRequest req) {
//        String trace = UUID.randomUUID().toString();
//        log.error("Unhandled error [{}]", trace, ex);
//        return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "An unexpected error occurred",
//                req.getRequestURI(), null, trace);
//    }
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuth(AuthenticationException ex, HttpServletRequest req) {
        String trace = java.util.UUID.randomUUID().toString();
        // Don’t leak which field was wrong
        return build(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS",
                "Invalid email or password", req.getRequestURI(), null, trace);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, Object> details = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            details.put(fe.getField(), fe.getDefaultMessage());
        }
        String path = request.getDescription(false).replace("uri=", "");
        String trace = UUID.randomUUID().toString();
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Validation failed", path, details, trace);
    }
}