package com.skillshare.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String content;
    private List<String> mediaUrls;
    private List<String> mediaTypes;
    private Date createdAt = new Date();

    private Map<String, String> reactions = new HashMap<>();     // userId → emoji
    private Map<String, String> reactionUsers = new HashMap<>(); // userId → userName

    private List<Comment> comments; // ✅ Add this field
}
