package com.skillshare.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents a Post entity in the application.
 * This class is mapped to the "posts" collection in MongoDB.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id; // Unique identifier for the post

    private String userId; // ID of the user who created the post

    private String content; // Text content of the post

    private List<String> mediaUrls; // URLs to media files

    private List<String> mediaTypes; // Types of media (image, video, etc.)

    private Date createdAt = new Date(); // Timestamp for post creation

    private Map<String, String> reactions = new HashMap<>();     // userId → emoji

    private Map<String, String> reactionUsers = new HashMap<>(); // userId → userName

    private List<Comment> comments; // List of comments
}
