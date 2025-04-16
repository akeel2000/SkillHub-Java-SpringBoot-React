package com.skillshare.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.skillshare.backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    // You can add custom methods like:
    User findByEmail(String email);
}
