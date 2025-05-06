package com.skillshare.backend.api;

import com.skillshare.backend.model.Post;
import com.skillshare.backend.repository.PostRepository;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepo;

    /**
     * Endpoint to create a new post.
     * Accepts userId, optional content, and optional media files
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam String userId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media) {
        // Define the folder path for storing media files
        String folderPath = System.getProperty("user.dir") + "/media/";
        new File(folderPath).mkdirs(); // Ensure the folder exists

        List<String> mediaUrls = new ArrayList<>();
        List<String> mediaTypes = new ArrayList<>();

        // Process each media file if provided
        if (media != null && !media.isEmpty()) {
            for (MultipartFile file : media) {
                String ext = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
                String type = ext.matches("mp4|webm") ? "video" : "image"; // Determine media type
                String filename = UUID.randomUUID() + "." + ext; // Generate a unique filename

                try {
                    // Save the file to the server
                    file.transferTo(new File(folderPath + filename));
                    mediaUrls.add("/media/" + filename); // Store the file URL
                    mediaTypes.add(type); // Store the media type
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Media upload failed");
                }
            }
        }

        // Create a new Post object and populate its fields
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setMediaUrls(mediaUrls);
        post.setMediaTypes(mediaTypes);
        post.setCreatedAt(new Date());

        return ResponseEntity.ok(postRepo.save(post));
    }

    /**
     * Allows updating content and/or media files.
     */
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media) {
        // Fetch the post by ID
        Optional<Post> optionalPost = postRepo.findById(postId);
        if (optionalPost.isEmpty())
            return ResponseEntity.notFound().build();

        Post post = optionalPost.get();

        // Update content if provided
        if (content != null)
            post.setContent(content);

        // Process and update media files if provided
        if (media != null && !media.isEmpty()) {
            String folderPath = System.getProperty("user.dir") + "/media/";
            new File(folderPath).mkdirs(); // Ensure the folder exists
            List<String> mediaUrls = new ArrayList<>();
            List<String> mediaTypes = new ArrayList<>();

            for (MultipartFile file : media) {
                String ext = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
                String type = ext.matches("mp4|webm") ? "video" : "image"; // Determine media type
                String filename = UUID.randomUUID() + "." + ext; // Generate a unique filename

                try {
                    // Save the file to the server
                    file.transferTo(new File(folderPath + filename));
                    mediaUrls.add("/media/" + filename); // Store the file URL
                    mediaTypes.add(type); // Store the media type
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Media upload failed");
                }
            }

            // Update the post's media URLs and types
            post.setMediaUrls(mediaUrls);
            post.setMediaTypes(mediaTypes);
        }

        // Save the updated post to the database and return the response
        return ResponseEntity.ok(postRepo.save(post));
    }

    /**
     * Endpoint to delete a post by its ID.
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        // Check if the post exists
        if (!postRepo.existsById(postId))
            return ResponseEntity.notFound().build();

        // Delete the post
        postRepo.deleteById(postId);
        return ResponseEntity.ok("Post deleted");
    }

    /**
     * Endpoint to fetch a post by its ID.
     */
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        // Fetch the post and return it if found
        return postRepo.findById(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint to fetch all posts.
     */
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        // Return all posts from the database
        return ResponseEntity.ok(postRepo.findAll());
    }

    /**
     * Endpoint to fetch all posts by a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable String userId) {
        // Return all posts created by the specified user
        return ResponseEntity.ok(postRepo.findByUserId(userId));
    }
}
