package com.fnb.tracking.repository;

import com.fnb.tracking.model.ChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, Long> {
    List<ChangeRequest> findByLoggedById(Long userId);
    List<ChangeRequest> findByProjectId(Long projectId);
    List<ChangeRequest> findByStatus(String status);
}
