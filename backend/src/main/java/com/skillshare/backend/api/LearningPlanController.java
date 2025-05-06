package com.skillshare.backend.api;

import com.skillshare.backend.model.LearningPlan;
import com.skillshare.backend.model.Milestone;
import com.skillshare.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repo;

    // CRUD Plan
    @PostMapping
    public LearningPlan create(@RequestBody LearningPlan plan) {
        return repo.save(plan);
    }

    @GetMapping("/user/{userId}")
    public List<LearningPlan> getUserPlans(@PathVariable String userId) {
        return repo.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public LearningPlan getPlan(@PathVariable String id) {
        return repo.findById(id).orElse(null);
    }

    @GetMapping("/public")
    public List<LearningPlan> getPublicPlans() {
        return repo.findByIsPublicTrue();
    }

    @GetMapping("/tag/{tag}")
    public List<LearningPlan> getPlansByTag(@PathVariable String tag) {
        return repo.findByTagsContainingIgnoreCase(tag);
    }

    @PutMapping("/{id}")
    public LearningPlan update(@PathVariable String id, @RequestBody LearningPlan plan) {
        plan.setId(id);
        return repo.save(plan);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repo.deleteById(id);
    }

    // 📌 Extra Features  Add-resource
    @PutMapping("/{id}/add-resource")
    public LearningPlan addResource(@PathVariable String id, @RequestBody String resource) {
        LearningPlan plan = repo.findById(id).orElse(null);
        if (plan != null) {
            plan.getResources().add(resource);
            return repo.save(plan);
        }
        return null;
    }
   //Add update
    @PutMapping("/{id}/update-milestones")
    public LearningPlan updateMilestones(@PathVariable String id, @RequestBody List<Milestone> milestones) {
        LearningPlan plan = repo.findById(id).orElse(null);
        if (plan != null) {
            plan.setMilestones(milestones);
            return repo.save(plan);
        }
        return null;
    }


    
}
