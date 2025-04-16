package com.skillshare.backend.requests;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
