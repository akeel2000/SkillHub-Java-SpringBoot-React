package com.skillshare.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "group_members")
public class GroupMember {
    @Id
    private String id;
    private String groupId;
    private String userId;
    private String role; // "member" or "moderator"
}
