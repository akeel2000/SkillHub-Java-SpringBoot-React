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
    private PostRepository postRepo;
    @Autowired
    private UserRepository userRepo;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam String userId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media
    ) {
        String folderPath = System.getProperty("user.dir") + "/media/";
        new File(folderPath).mkdirs();

        List<String> mediaUrls = new ArrayList<>();
        List<String> mediaTypes = new ArrayList<>();

        if (media != null && !media.isEmpty()) {
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
        }

        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setMediaUrls(mediaUrls);
        post.setMediaTypes(mediaTypes);
        post.setCreatedAt(new Date());

        return ResponseEntity.ok(postRepo.save(post));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media
    ) {
        Optional<Post> optionalPost = postRepo.findById(postId);
        if (optionalPost.isEmpty()) return ResponseEntity.notFound().build();

        Post post = optionalPost.get();
        if (content != null) post.setContent(content);

        if (media != null && !media.isEmpty()) {
            String folderPath = System.getProperty("user.dir") + "/media/";
            new File(folderPath).mkdirs();
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

            post.setMediaUrls(mediaUrls);
            post.setMediaTypes(mediaTypes);
        }

        return ResponseEntity.ok(postRepo.save(post));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        if (!postRepo.existsById(postId)) return ResponseEntity.notFound().build();
        postRepo.deleteById(postId);
        return ResponseEntity.ok("Post deleted");
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        return postRepo.findById(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(postRepo.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(postRepo.findByUserId(userId));
    }

// Backend Java (Controller)
@PostMapping("/{postId}/comment")
public ResponseEntity<?> addComment(@PathVariable String postId, @RequestBody Comment comment) {
    Optional<Post> optionalPost = postRepo.findById(postId);
    if (optionalPost.isEmpty()) return ResponseEntity.notFound().build();

    Post post = optionalPost.get();
    if (post.getComments() == null) post.setComments(new ArrayList<>());
    comment.setCommentedAt(new Date());
    if (comment.getUserName() == null || comment.getUserName().isEmpty()) {
        comment.setUserName(getUserNameById(comment.getUserId()));
    }
    post.getComments().add(comment);
    return ResponseEntity.ok(postRepo.save(post));
}

@PutMapping("/{postId}/react")
public ResponseEntity<?> reactToPost(
        @PathVariable String postId,
        @RequestParam String userId,
        @RequestParam String reaction
) {
    Optional<Post> optionalPost = postRepo.findById(postId);
    if (optionalPost.isEmpty()) return ResponseEntity.notFound().build();

    Post post = optionalPost.get();
    if (post.getReactions() == null) post.setReactions(new HashMap<>());
    if (post.getReactionUsers() == null) post.setReactionUsers(new HashMap<>());

    // ✅ Auto-fetch name instead of receiving from frontend
    String userName = getUserNameById(userId);

    post.getReactions().put(userId, reaction);
    post.getReactionUsers().put(userId, userName);

    return ResponseEntity.ok(postRepo.save(post));
}


// Helper method to lookup user name from user service or database
private String getUserNameById(String userId) {
    return userRepo.findById(userId).map(User::getName).orElse("Anonymous");
}



}
