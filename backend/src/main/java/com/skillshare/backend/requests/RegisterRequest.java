package com.skillshare.backend.requests;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String lastName;
    private String email;
    private String password;
}
