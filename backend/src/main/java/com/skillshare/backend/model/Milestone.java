package com.skillshare.backend.model;

import lombok.Data;
import java.util.Date;

@Data
public class Milestone {
    private String description;
    private Date targetDate;
    private boolean completed;
}
