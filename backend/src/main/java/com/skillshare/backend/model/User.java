// --- User.java ---
package com.skillshare.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    private String name;
    private String lastName;
    private String email;
    private String password;
    private String profilePic;
    private String coverPic;
    private List<String> categories;
    private String status = "active";
    private int tokenVersion = 0;
}
