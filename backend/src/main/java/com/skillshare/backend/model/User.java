package com.skillshare.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document("users") // MongoDB collection name
public class User {

    @Id
    private String id;  // MongoDB uses String as ID (_id)

    @NotNull
    private String name;

    @NotNull
    @Email
    private String email;

    @NotNull
    private String lastName;

    @NotNull
    private String password;

    // Related document IDs (not full objects)
    private List<String> followingIds;
    private List<String> followerIds;
    private List<String> postIds;
    private List<String> likeIds;
    private List<String> imageIds;
    private List<String> commentIds;
}
