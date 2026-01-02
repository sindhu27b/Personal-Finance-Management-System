package org.project.fintrack.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resource, Object id) {
        super(HttpStatus.NOT_FOUND, "NOT_FOUND", resource + " with id=" + id + " not found");
    }
}