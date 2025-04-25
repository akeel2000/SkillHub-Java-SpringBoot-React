package com.skillshare.backend.repository;

import com.skillshare.backend.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findByIsPublicTrue();
    List<LearningPlan> findByTagsContainingIgnoreCase(String tag);
}
