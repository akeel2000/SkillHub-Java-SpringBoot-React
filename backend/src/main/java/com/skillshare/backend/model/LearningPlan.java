package com.skillshare.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

 // Model class representing a Learning Plan document in MongoDB.

@Data
@Document(collection = "learning_plans")
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String title;
    private String goal;
    private List<String> resources;
    private Date startDate;
    private Date endDate;
    private List<String> tags;
    private boolean isPublic;
    private List<Milestone> milestones;
}
