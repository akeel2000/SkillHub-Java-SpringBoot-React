package com.skillshare.backend.api;

import com.skillshare.backend.model.User;
import com.skillshare.backend.repository.UserRepository;
import com.skillshare.backend.requests.LoginRequest;
import com.skillshare.backend.requests.RegisterRequest;
import com.skillshare.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for authentication and user profile management.
 * Handles registration, login, profile updates, password changes, and more.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    //Register a new user.
     
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (req.getName() == null || req.getLastName() == null || req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All fields are required");
        }
        User user = new User();
        user.setName(req.getName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("User registered");
    }

    //Login endpoint, Returns JWT token if credentials are valid.
     
    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }
        User user = userRepo.findByEmail(req.getEmail());
        if (user != null && encoder.matches(req.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    //Update user profile information and images.
     
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

    //Delete a user by email
     
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

    //Save user categories/interests
     
    @PostMapping("/categories")
    public ResponseEntity<?> saveCategories(@RequestParam String email, @RequestBody List<String> categories) {
        User user = userRepo.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        user.setCategories(categories);
        userRepo.save(user);
        return ResponseEntity.ok("Categories updated");
    }

    //Get user by email
     
    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestParam String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        return ResponseEntity.ok(user);
    }

    //Get public profile by user ID.
     
    @GetMapping("/public-profile/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        return userRepo.findById(id)
                .map((User user) -> ResponseEntity.ok((Object) user))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    //Logout endpoint (clears Spring Security context).
    
    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out");
    }

    //Search users by name (case-insensitive)
     
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String name) {
        List<User> users = userRepo.findAll()
            .stream()
            .filter(u -> u.getName().toLowerCase().contains(name.toLowerCase()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    //Change user password
     
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam String email,
            @RequestParam String oldPassword,
            @RequestParam String newPassword
    ) {
        User user = userRepo.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        if (!encoder.matches(oldPassword, user.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect old password");

        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
        return ResponseEntity.ok("Password changed successfully");
    }

    // Logout from all devices (invalidate all tokens).
     
    @PutMapping("/logout-all")
    public ResponseEntity<?> logoutAllDevices(@RequestParam String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        user.setTokenVersion(user.getTokenVersion() + 1); // invalidate all tokens
        userRepo.save(user);
        return ResponseEntity.ok("Logged out from all devices");
    }

    //Deactivate user account (set status to "deactivated").
     
    @PutMapping("/deactivate")
    public ResponseEntity<?> deactivate(@RequestParam String email) {
        User user = userRepo.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        user.setStatus("deactivated");
        userRepo.save(user);
        return ResponseEntity.ok("Account deactivated");
    }

    //Change user email address

    @PutMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestParam String oldEmail, @RequestParam String newEmail) {
        User user = userRepo.findByEmail(oldEmail);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        if (userRepo.findByEmail(newEmail) != null)
            return ResponseEntity.status(HttpStatus.CONFLICT).body("New email already in use");

        user.setEmail(newEmail);
        userRepo.save(user);
        return ResponseEntity.ok("Email updated successfully");
    }
}