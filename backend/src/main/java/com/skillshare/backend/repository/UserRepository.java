package com.skillshare.backend.repository;

import com.skillshare.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    // ✅ Finds user by exact email
    User findByEmail(String email);

    // ✅ Supports case-insensitive name or email search for search bars
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
