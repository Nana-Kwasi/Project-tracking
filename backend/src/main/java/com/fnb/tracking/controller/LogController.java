package com.fnb.tracking.controller;

import com.fnb.tracking.model.Log;
import com.fnb.tracking.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:3000")
public class LogController {
    @Autowired
    private LogRepository logRepository;
    
    @GetMapping
    public ResponseEntity<List<Log>> getLogs(
            @RequestParam(required = false) String date) {
        List<Log> logs;
        
        if (date != null && !date.isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(date);
                LocalDateTime startOfDay = localDate.atStartOfDay();
                LocalDateTime endOfDay = localDate.atTime(23, 59, 59);
                logs = logRepository.findByCreatedAtBetween(
                    startOfDay, 
                    endOfDay,
                    PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "createdAt"))
                );
            } catch (Exception e) {
                // Invalid date format, return latest 10 logs
                Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
                logs = logRepository.findAll(pageable).getContent();
            }
        } else {
            // Get latest 10 logs
            Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
            logs = logRepository.findAll(pageable).getContent();
        }
        
        return ResponseEntity.ok(logs);
    }
}
