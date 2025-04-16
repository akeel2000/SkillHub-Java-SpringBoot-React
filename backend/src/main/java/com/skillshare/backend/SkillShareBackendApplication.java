package com.skillshare.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity // Enables @PreAuthorize and @Secured
public class SkillShareBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillShareBackendApplication.class, args);
    }
}

