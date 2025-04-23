package com.skillshare.backend.api;

import com.skillshare.backend.model.Story;
import com.skillshare.backend.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin
public class StoryController {

    @Autowired
    private StoryRepository storyRepo;

    // ✅ Upload a new story with logging and error handling
    @PostMapping
    public ResponseEntity<?> uploadStory(
            @RequestParam String email,
            @RequestParam String userId,
            @RequestParam(required = false) MultipartFile media,
            @RequestParam(required = false) String text
    ) {
        try {
            // ✅ Debug logs
            System.out.println("=== ADD STORY DEBUG ===");
            System.out.println("Email: " + email);
            System.out.println("UserId: " + userId);
            System.out.println("Text: " + text);
            System.out.println("Media: " + (media != null ? media.getOriginalFilename() : "No file uploaded"));

            String mediaPath = null;

            if (media != null && !media.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + media.getOriginalFilename();
                String uploadPath = System.getProperty("user.dir") + "/uploads/";
                System.out.println("Upload path: " + uploadPath); // ✅ Log path

                new File(uploadPath).mkdirs();
                File file = new File(uploadPath + fileName);

                try {
                    media.transferTo(file);
                    mediaPath = "/uploads/" + fileName;
                } catch (IOException e) {
                    e.printStackTrace(); // ✅ Log exception
                    return ResponseEntity.status(500).body("Media upload failed: " + e.getMessage());
                }
            }

            Story story = new Story();
            story.setEmail(email);
            story.setUserId(userId);
            story.setText(text);
            story.setMediaUrl(mediaPath);

            return ResponseEntity.ok(storyRepo.save(story));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Story upload failed: " + e.getMessage());
        }
    }

    // ✅ Get all stories sorted by creation time (latest first)
    @GetMapping
    public ResponseEntity<?> getAllStories() {
        return ResponseEntity.ok(storyRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    // ✅ Register a story view by viewer
    @PutMapping("/view/{storyId}")
    public ResponseEntity<?> viewStory(@PathVariable String storyId, @RequestParam String viewerId) {
        Optional<Story> optional = storyRepo.findById(storyId);
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body("Story not found");
        }

        Story story = optional.get();
        if (story.getViewedBy() == null) {
            story.setViewedBy(new java.util.ArrayList<>());
        }

        if (!story.getViewedBy().contains(viewerId)) {
            story.getViewedBy().add(viewerId);
            storyRepo.save(story);
        }

        return ResponseEntity.ok("View registered");
    }

    // ✅ Update story text
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStory(@PathVariable String id, @RequestBody Story updated) {
        Optional<Story> optionalStory = storyRepo.findById(id);
        if (optionalStory.isPresent()) {
            Story story = optionalStory.get();
            story.setText(updated.getText());
            return ResponseEntity.ok(storyRepo.save(story));
        } else {
            return ResponseEntity.status(404).body("Story not found");
        }
    }

    // ✅ Delete story if it belongs to the user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable String id, @RequestParam String userId) {
        Optional<Story> optionalStory = storyRepo.findById(id);
        if (optionalStory.isPresent()) {
            Story story = optionalStory.get();
            if (!story.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }
            storyRepo.delete(story);
            return ResponseEntity.ok("Deleted");
        } else {
            return ResponseEntity.status(404).body("Story not found");
        }
    }

    // ✅ Get story viewers
    @GetMapping("/{id}/viewers")
    public ResponseEntity<?> getStoryViewers(@PathVariable String id) {
        Optional<Story> optionalStory = storyRepo.findById(id);
        if (optionalStory.isPresent()) {
            return ResponseEntity.ok(optionalStory.get().getViewedBy());
        } else {
            return ResponseEntity.status(404).body("Story not found");
        }
    }
}
