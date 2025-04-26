package com.skillshare.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

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

    private List<String> mediaUrls; // List of URLs pointing to the media files associated with the post

    private List<String> mediaTypes; // List of media types (e.g., "image", "video") corresponding to the media files

    private Date createdAt = new Date(); // Timestamp indicating when the post was created
}
