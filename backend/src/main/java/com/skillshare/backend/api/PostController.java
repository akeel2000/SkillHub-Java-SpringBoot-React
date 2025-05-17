package com.skillshare.backend.api;

import com.skillshare.backend.model.Post;
import com.skillshare.backend.repository.PostRepository;
import com.skillshare.backend.repository.UserRepository;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.skillshare.backend.model.Comment;
import com.skillshare.backend.model.User;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepo; // Handles database operations for posts

    @Autowired
    private UserRepository userRepo; // Handles database operations for users

    /**
     * This endpoint lets a user create a new post.
     * The user can provide their userId, some text content, and optionally upload
     * media files (images/videos).
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam String userId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media) {
        // We'll store uploaded media files in a 'media' folder inside the project
        // directory
        String folderPath = System.getProperty("user.dir") + "/media/";
        new File(folderPath).mkdirs(); // Make sure the folder exists

        List<String> mediaUrls = new ArrayList<>(); // To store URLs of uploaded media
        List<String> mediaTypes = new ArrayList<>(); // To store type (image/video) for each media

        // If the user uploaded any media files, process and save them
        if (media != null && !media.isEmpty()) {
            for (MultipartFile file : media) {
                // Get the file extension to determine its type
                String ext = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
                // If the extension is mp4 or webm, treat as video, otherwise as image
                String type = ext.matches("mp4|webm") ? "video" : "image";
                // Generate a unique filename to avoid conflicts
                String filename = UUID.randomUUID() + "." + ext;

                try {
                    // Save the file to the server's media folder
                    file.transferTo(new File(folderPath + filename));
                    // Store the URL and type for later use
                    mediaUrls.add("/media/" + filename);
                    mediaTypes.add(type);
                } catch (IOException e) {
                    // If something goes wrong during upload, return an error
                    return ResponseEntity.status(500).body("Media upload failed");
                }
            }
        }

        // Create a new Post object and fill in its details
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setMediaUrls(mediaUrls);
        post.setMediaTypes(mediaTypes);
        post.setCreatedAt(new Date()); // Set the current time as the creation time

        // Save the post to the database and return it in the response
        return ResponseEntity.ok(postRepo.save(post));
    }

    /**
     * This endpoint allows users to update an existing post.
     * They can change the content and/or upload new media files.
     */
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media) {
        // Try to find the post in the database
        Optional<Post> optionalPost = postRepo.findById(postId);
        if (optionalPost.isEmpty())
            return ResponseEntity.notFound().build(); // If not found, return 404

        Post post = optionalPost.get();

        // If new content is provided, update it
        if (content != null)
            post.setContent(content);

        // If new media files are provided, process and update them
        if (media != null && !media.isEmpty()) {
            String folderPath = System.getProperty("user.dir") + "/media/";
            new File(folderPath).mkdirs(); // Make sure the folder exists
            List<String> mediaUrls = new ArrayList<>();
            List<String> mediaTypes = new ArrayList<>();

            for (MultipartFile file : media) {
                String ext = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
                String type = ext.matches("mp4|webm") ? "video" : "image";
                String filename = UUID.randomUUID() + "." + ext;

                try {
                    file.transferTo(new File(folderPath + filename));
                    mediaUrls.add("/media/" + filename);
                    mediaTypes.add(type);
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Media upload failed");
                }
            }

            // Replace the post's media with the new ones
            post.setMediaUrls(mediaUrls);
            post.setMediaTypes(mediaTypes);
        }

        // Save the updated post and return it
        return ResponseEntity.ok(postRepo.save(post));
    }

    /**
     * This endpoint deletes a post by its ID.
     * If the post doesn't exist, it returns a 404 error.
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        // Check if the post exists before trying to delete
        if (!postRepo.existsById(postId))
            return ResponseEntity.notFound().build();

        // Remove the post from the database
        postRepo.deleteById(postId);
        return ResponseEntity.ok("Post deleted");
    }

    /**
     * This endpoint fetches a single post by its ID.
     * If the post exists, it returns the post; otherwise, it returns 404.
     */
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        // Try to find the post and return it, or 404 if not found
        return postRepo.findById(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * This endpoint returns all posts in the database.
     */
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        // Fetch and return all posts
        return ResponseEntity.ok(postRepo.findAll());
    }

    /**
     * This endpoint returns all posts created by a specific user.
     * The user is identified by their userId.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable String userId) {
        // Fetch and return all posts for the given user
        return ResponseEntity.ok(postRepo.findByUserId(userId));
    }

    /**
     * This endpoint allows users to add a comment to a post.
     * The comment is added to the post's list of comments.
     */
    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> addComment(@PathVariable String postId, @RequestBody Comment comment) {
        // Try to find the post to comment on
        Optional<Post> optionalPost = postRepo.findById(postId);
        if (optionalPost.isEmpty())
            return ResponseEntity.notFound().build();

        Post post = optionalPost.get();
        // If the post doesn't have any comments yet, initialize the list
        if (post.getComments() == null)
            post.setComments(new ArrayList<>());
        // Set the time the comment was made
        comment.setCommentedAt(new Date());
        // If the comment doesn't have a user name, look it up using the userId
        if (comment.getUserName() == null || comment.getUserName().isEmpty()) {
            comment.setUserName(getUserNameById(comment.getUserId()));
        }
        // Add the comment to the post
        post.getComments().add(comment);
        // Save the updated post and return it
        return ResponseEntity.ok(postRepo.save(post));
    }

    /**
     * This endpoint lets users react to a post (like, love, etc.).
     * The reaction is stored along with the user's name.
     */
    @PutMapping("/{postId}/react")
    public ResponseEntity<?> reactToPost(
            @PathVariable String postId,
            @RequestParam String userId,
            @RequestParam String reaction) {
        // Try to find the post to react to
        Optional<Post> optionalPost = postRepo.findById(postId);
        if (optionalPost.isEmpty())
            return ResponseEntity.notFound().build();

        Post post = optionalPost.get();
        // If the post doesn't have any reactions yet, initialize the maps
        if (post.getReactions() == null)
            post.setReactions(new HashMap<>());
        if (post.getReactionUsers() == null)
            post.setReactionUsers(new HashMap<>());

        // Look up the user's name using their userId
        String userName = getUserNameById(userId);

        // Store the reaction and the user's name
        post.getReactions().put(userId, reaction);
        post.getReactionUsers().put(userId, userName);

        // Save the updated post and return it
        return ResponseEntity.ok(postRepo.save(post));
    }

    /**
     * Helper method to look up a user's name by their userId.
     * If the user isn't found, returns "Anonymous".
     */
    private String getUserNameById(String userId) {
        return userRepo.findById(userId).map(User::getName).orElse("Anonymous");
    }

}
