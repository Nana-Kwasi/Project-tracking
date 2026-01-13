package com.fnb.tracking.repository;

import com.fnb.tracking.model.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByProjectId(Long projectId);
    List<StatusHistory> findByChangeRequestId(Long changeRequestId);
}
