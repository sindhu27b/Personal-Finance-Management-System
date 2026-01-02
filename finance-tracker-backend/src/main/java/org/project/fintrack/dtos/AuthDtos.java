package org.project.fintrack.dtos;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public static class LoginRequest {
        @Email @NotBlank public String email;
        @NotBlank public String password;
    }
    public static class RegisterRequest {
        @NotBlank public String name;
        @Email @NotBlank public String email;
        @NotBlank public String password;
    }

    // Generic message response (e.g., for registration success)
    public static class ApiMessageResponse {
        public int status;
        public String message;
        public ApiMessageResponse(int status, String message) {
            this.status = status; this.message = message;
        }
    }

    // Login response with token
    public static class LoginResponse {
        public int status;
        public String message;
        public String token;
        public LoginResponse(int status, String message, String token) {
            this.status = status; this.message = message; this.token = token;
        }
    }
}