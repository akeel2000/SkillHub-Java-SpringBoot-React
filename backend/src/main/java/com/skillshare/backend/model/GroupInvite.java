package com.skillshare.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "group_invites")
public class GroupInvite {
    @Id
    private String id;
    private String groupId;
    private String invitedUserId;
    private String invitedById;
    private String status; // "pending", "accepted", "rejected"
    private Date sentAt = new Date();
}
