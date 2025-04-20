package com.skillshare.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    private String id;
    private String userId;
    private String content;
    private String mediaUrl;   // Path to image/video
    private String mediaType;  // "image" or "video"
    private Date createdAt;
}
