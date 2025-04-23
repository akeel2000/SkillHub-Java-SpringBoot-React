package com.skillshare.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "stories")
public class Story {
    @Id
    private String id;

    private String userId;
    private String email;
    private String text;
    private String mediaUrl;
    private Date createdAt = new Date();
    private List<String> viewedBy = new ArrayList<>();
}

