package com.skillshare.backend.repository;

import com.skillshare.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

/**
 * Repository interface for managing Post entities in MongoDB.
 * Extends MongoRepository to provide CRUD operations and custom query methods.
 */
public interface PostRepository extends MongoRepository<Post, String> {

    /**
     * Finds all posts created by a specific user.
     *
     * @param userId The ID of the user whose posts are to be retrieved.
     * @return A list of posts created by the specified user.
     */
    List<Post> findByUserId(String userId);
}
