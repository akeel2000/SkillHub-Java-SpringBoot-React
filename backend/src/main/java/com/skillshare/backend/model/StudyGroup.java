

package com.skillshare.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Data
@Document(collection = "study_groups")
public class StudyGroup {
    @Id
    private String id;
    private String name;
    private String description;
    private String creatorId; // Group Owner
    private List<String> memberIds;
    private List<String> pinnedResources; // (URLs, PDFs, Videos)
    private Date createdAt = new Date();
}

