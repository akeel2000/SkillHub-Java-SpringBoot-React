package com.skillshare.backend.services;

import com.skillshare.backend.model.Story;
import com.skillshare.backend.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoryCleanupService {

    @Autowired
    private StoryRepository storyRepo;

    @Scheduled(fixedRate = 3600000) // Every 1 hour
    public void removeExpiredStories() {
        Date now = new Date();
        List<Story> expired = storyRepo.findAll().stream()
            .filter(story -> now.getTime() - story.getCreatedAt().getTime() > 24 * 60 * 60 * 1000)
            .collect(Collectors.toList());

        if (!expired.isEmpty()) {
            storyRepo.deleteAll(expired);
        }
    }
}
