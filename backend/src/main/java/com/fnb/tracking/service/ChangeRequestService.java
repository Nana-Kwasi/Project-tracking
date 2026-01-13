package com.fnb.tracking.service;

import com.fnb.tracking.dto.ChangeRequestDTO;
import com.fnb.tracking.dto.StatusUpdateDTO;
import com.fnb.tracking.model.ChangeRequest;
import com.fnb.tracking.model.Project;
import com.fnb.tracking.model.StatusHistory;
import com.fnb.tracking.model.User;
import com.fnb.tracking.repository.ChangeRequestRepository;
import com.fnb.tracking.repository.ProjectRepository;
import com.fnb.tracking.repository.StatusHistoryRepository;
import com.fnb.tracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChangeRequestService {
    @Autowired
    private ChangeRequestRepository changeRequestRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StatusHistoryRepository statusHistoryRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private LogService logService;
    
    public ChangeRequestDTO createChangeRequest(ChangeRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Project project = projectRepository.findById(dto.getProjectId()).orElseThrow();
        
        ChangeRequest changeRequest = new ChangeRequest();
        changeRequest.setProject(project);
        changeRequest.setRequestedFeature(dto.getRequestedFeature());
        changeRequest.setReasonForChange(dto.getReasonForChange());
        changeRequest.setImpactLevel(dto.getImpactLevel());
        changeRequest.setStatus("PENDING");
        changeRequest.setLoggedBy(user);
        
        changeRequest = changeRequestRepository.save(changeRequest);
        logService.logAction(userId, "CREATE_CHANGE_REQUEST", "CHANGE_REQUEST", changeRequest.getId(), 
            "Created change request for project: " + project.getProjectId(), null);
        
        return convertToDTO(changeRequest);
    }
    
    public List<ChangeRequestDTO> getAllChangeRequests() {
        return changeRequestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ChangeRequestDTO> getUserChangeRequests(Long userId) {
        return changeRequestRepository.findByLoggedById(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ChangeRequestDTO> getChangeRequestsByProject(Long projectId) {
        return changeRequestRepository.findByProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ChangeRequestDTO updateChangeRequestStatus(Long changeRequestId, StatusUpdateDTO statusUpdate, Long adminId) {
        ChangeRequest changeRequest = changeRequestRepository.findById(changeRequestId).orElseThrow();
        User admin = userRepository.findById(adminId).orElseThrow();
        
        String oldStatus = changeRequest.getStatus();
        changeRequest.setStatus(statusUpdate.getStatus());
        
        StatusHistory history = new StatusHistory();
        history.setChangeRequest(changeRequest);
        history.setOldStatus(oldStatus);
        history.setNewStatus(statusUpdate.getStatus());
        history.setUpdatedBy(admin);
        if ("REJECTED".equals(statusUpdate.getStatus()) && statusUpdate.getRejectionReason() != null) {
            history.setRejectionReason(statusUpdate.getRejectionReason());
        }
        statusHistoryRepository.save(history);
        
        changeRequest = changeRequestRepository.save(changeRequest);
        
        notificationService.createNotification(
            changeRequest.getLoggedBy().getId(),
            null,
            changeRequest.getId(),
            "STATUS_UPDATE",
            "Change request for project " + changeRequest.getProject().getProjectId() + " status updated to " + statusUpdate.getStatus()
        );
        
        logService.logAction(adminId, "UPDATE_STATUS", "CHANGE_REQUEST", changeRequestId, 
            "Updated change request status from " + oldStatus + " to " + statusUpdate.getStatus(), null);
        
        return convertToDTO(changeRequest);
    }
    
    private ChangeRequestDTO convertToDTO(ChangeRequest changeRequest) {
        ChangeRequestDTO dto = new ChangeRequestDTO();
        dto.setId(changeRequest.getId());
        dto.setProjectId(changeRequest.getProject().getId());
        dto.setProjectName(changeRequest.getProject().getProjectName());
        dto.setProjectProjectId(changeRequest.getProject().getProjectId());
        dto.setRequestedFeature(changeRequest.getRequestedFeature());
        dto.setReasonForChange(changeRequest.getReasonForChange());
        dto.setImpactLevel(changeRequest.getImpactLevel());
        dto.setStatus(changeRequest.getStatus());
        dto.setLoggedBy(changeRequest.getLoggedBy().getFNumber());
        dto.setLoggedById(changeRequest.getLoggedBy().getId());
        dto.setCreatedAt(changeRequest.getCreatedAt());
        dto.setUpdatedAt(changeRequest.getUpdatedAt());
        return dto;
    }
}
