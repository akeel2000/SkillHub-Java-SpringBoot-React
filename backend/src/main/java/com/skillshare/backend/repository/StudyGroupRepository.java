package com.skillshare.backend.repository;



import com.skillshare.backend.model.StudyGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface StudyGroupRepository extends MongoRepository<StudyGroup, String> {
    List<StudyGroup> findByCreatorId(String creatorId);
    List<StudyGroup> findByMemberIdsContains(String memberId);
}
