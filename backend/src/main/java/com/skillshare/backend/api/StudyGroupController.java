package com.skillshare.backend.api;


import com.skillshare.backend.model.StudyGroup;
import com.skillshare.backend.repository.StudyGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class StudyGroupController {

    @Autowired
    private StudyGroupRepository groupRepo;

    // Create a new group//
    @PostMapping
    public StudyGroup createGroup(@RequestBody StudyGroup group) {
        return groupRepo.save(group);
    }

    // Get groups created by a user//
    @GetMapping("/created/{creatorId}")
    public List<StudyGroup> getGroupsCreatedByUser(@PathVariable String creatorId) {
        return groupRepo.findByCreatorId(creatorId);
    }

    // Get groups where user is a member //
    @GetMapping("/joined/{userId}")
    public List<StudyGroup> getGroupsUserJoined(@PathVariable String userId) {
        return groupRepo.findByMemberIdsContains(userId);
    }

    // Get single group by ID//
    @GetMapping("/{id}")
    public StudyGroup getGroupById(@PathVariable String id) {
        return groupRepo.findById(id).orElse(null);
    }


    // Update group (name, description, pinned resources)//
    @PutMapping("/{id}")
    public StudyGroup updateGroup(@PathVariable String id, @RequestBody StudyGroup updatedGroup) {
        updatedGroup.setId(id);
        return groupRepo.save(updatedGroup);
    }


    // Delete a group//
    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable String id) {
        groupRepo.deleteById(id);
    }

    // Get all groups (public)////
@GetMapping
public List<StudyGroup> getAllGroups() {
    return groupRepo.findAll();
}

}
