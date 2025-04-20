package com.skillshare.backend.api;

import com.skillshare.backend.model.Post;
import com.skillshare.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils;


@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired private PostRepository postRepo;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
        @RequestParam String userId,
        @RequestParam(required = false) String content,
        @RequestParam(required = false) MultipartFile media
    ) {
        String folderPath = System.getProperty("user.dir") + "/media/";
        new File(folderPath).mkdirs();

        String mediaUrl = null;
        String mediaType = null;

        if (media != null && !media.isEmpty()) {
            try {
                String ext = FilenameUtils.getExtension(media.getOriginalFilename());
                mediaType = ext.matches("mp4|webm") ? "video" : "image";
                String filename = UUID.randomUUID() + "." + ext;
                File dest = new File(folderPath + filename);
                media.transferTo(dest);
                mediaUrl = "/media/" + filename;
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Upload failed");
            }
        }

        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setMediaUrl(mediaUrl);
        post.setMediaType(mediaType);
        post.setCreatedAt(new Date());

        return ResponseEntity.ok(postRepo.save(post));
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable String userId) {
        return postRepo.findByUserId(userId);
    }
}
