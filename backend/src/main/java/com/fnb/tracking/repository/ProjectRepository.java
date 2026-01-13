package com.fnb.tracking.repository;

import com.fnb.tracking.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByProjectId(String projectId);
    List<Project> findByLoggedById(Long userId);
    List<Project> findByStatus(String status);
    boolean existsByProjectId(String projectId);
}
