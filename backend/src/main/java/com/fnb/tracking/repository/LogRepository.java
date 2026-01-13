package com.fnb.tracking.repository;

import com.fnb.tracking.model.Log;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findByUserId(Long userId);
    List<Log> findByActionType(String actionType);
    List<Log> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
}
