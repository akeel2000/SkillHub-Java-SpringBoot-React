package com.skillshare.backend.model;

import lombok.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
  private String userId;
  private String userName;
  private String commentText;
  private Date commentedAt;

}
