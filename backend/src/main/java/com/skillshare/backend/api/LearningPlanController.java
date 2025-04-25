package com.skillshare.backend.api;

import com.skillshare.backend.model.LearningPlan;
import com.skillshare.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repo;

    // CREATE
    @PostMapping
    public LearningPlan create(@RequestBody LearningPlan plan) {
        return repo.save(plan);
    }

    // READ all plans by user
    @GetMapping("/user/{userId}")
    public List<LearningPlan> getUserPlans(@PathVariable String userId) {
        return repo.findByUserId(userId);
    }

    // READ a single plan by ID
    @GetMapping("/{id}")
    public LearningPlan getPlan(@PathVariable String id) {
        return repo.findById(id).orElse(null);
    }

    // READ all public plans
    @GetMapping("/public")
    public List<LearningPlan> getPublicPlans() {
        return repo.findByIsPublicTrue();
    }

    // UPDATE
    @PutMapping("/{id}")
    public LearningPlan update(@PathVariable String id, @RequestBody LearningPlan plan) {
        plan.setId(id);
        return repo.save(plan);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repo.deleteById(id);
    }
}
