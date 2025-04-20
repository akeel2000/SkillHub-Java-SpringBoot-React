package com.skillshare.backend.api;

import com.skillshare.backend.model.User;
import com.skillshare.backend.repository.UserRepository;
import com.skillshare.backend.security.JwtUtil;
import com.skillshare.backend.requests.LoginRequest;
import com.skillshare.backend.requests.RegisterRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = new User();
        user.setName(req.getName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail());
        if (user != null && encoder.matches(req.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @RequestParam String email,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) MultipartFile profilePic,
            @RequestParam(required = false) MultipartFile coverPic
    ) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (name != null) user.setName(name);
        if (lastName != null) user.setLastName(lastName);

        String folderPath = System.getProperty("user.dir") + "/images/";
        new File(folderPath).mkdirs();

        try {
            if (profilePic != null && !profilePic.isEmpty()) {
                String profileName = "profile_" + user.getId() + ".jpg";
                profilePic.transferTo(new File(folderPath + profileName));
                user.setProfilePic("/images/" + profileName);
            }

            if (coverPic != null && !coverPic.isEmpty()) {
                String coverName = "cover_" + user.getId() + ".jpg";
                coverPic.transferTo(new File(folderPath + coverName));
                user.setCoverPic("/images/" + coverName);
            }

            userRepo.save(user);
            return ResponseEntity.ok("Profile updated");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestParam String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepo.delete(user);

        String folderPath = System.getProperty("user.dir") + "/images/";
        new File(folderPath + "profile_" + user.getId() + ".jpg").delete();
        new File(folderPath + "cover_" + user.getId() + ".jpg").delete();

        return ResponseEntity.ok("User deleted");
    }

    @PostMapping("/categories")
    public ResponseEntity<?> saveCategories(@RequestParam String email, @RequestBody List<String> categories) {
        User user = userRepo.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        user.setCategories(categories);
        userRepo.save(user);
        return ResponseEntity.ok("Categories updated");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestParam String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        return ResponseEntity.ok(user);
    }

    @GetMapping("/public-profile/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        return userRepo.findById(id)
            .map((User user) -> ResponseEntity.ok((Object) user)) // ✅ explicitly cast to Object
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }
    
}
