package com.fnb.tracking.repository;

import com.fnb.tracking.model.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByProjectId(Long projectId);
    List<StatusHistory> findByChangeRequestId(Long changeRequestId);
    
    @Query("SELECT h FROM StatusHistory h WHERE h.project.id = :projectId AND h.newStatus = 'REJECTED' AND h.rejectionReason IS NOT NULL AND LENGTH(TRIM(h.rejectionReason)) > 0 ORDER BY h.createdAt DESC")
    List<StatusHistory> findRejectionHistoryByProjectId(Long projectId);
}
