package com.skillshare.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "group_posts")
public class GroupPost {
    @Id
    private String id;
    private String groupId;
    private String userId;
    private String content;
    private Date createdAt = new Date();
}
