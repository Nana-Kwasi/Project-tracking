package com.fnb.tracking.service;

import com.fnb.tracking.dto.ProjectDTO;
import com.fnb.tracking.dto.StatusUpdateDTO;
import com.fnb.tracking.model.Project;
import com.fnb.tracking.model.StatusHistory;
import com.fnb.tracking.model.User;
import com.fnb.tracking.repository.ProjectRepository;
import com.fnb.tracking.repository.StatusHistoryRepository;
import com.fnb.tracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ProjectService {
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
    
    private String generateProjectId() {
        Random random = new Random();
        int randomDigits = random.nextInt(100);
        return "FNBPJ" + String.format("%02d", randomDigits);
    }
    
    public ProjectDTO createProject(ProjectDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        
        String projectId;
        do {
            projectId = generateProjectId();
        } while (projectRepository.existsByProjectId(projectId));
        
        Project project = new Project();
        project.setProjectId(projectId);
        project.setProjectName(dto.getProjectName());
        project.setDepartment(dto.getDepartment());
        project.setBranch(dto.getBranch());
        project.setDescription(dto.getDescription());
        project.setPriorityLevel(Project.PriorityLevel.valueOf(dto.getPriorityLevel()));
        project.setStatus("PENDING");
        project.setLoggedBy(user);
        
        project = projectRepository.save(project);
        logService.logAction(userId, "CREATE_PROJECT", "PROJECT", project.getId(), "Created project: " + projectId, null);
        
        return convertToDTO(project);
    }
    
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDTO> getUserProjects(Long userId) {
        return projectRepository.findByLoggedById(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ProjectDTO updateProjectStatus(Long projectId, StatusUpdateDTO statusUpdate, Long adminId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        User admin = userRepository.findById(adminId).orElseThrow();
        
        String oldStatus = project.getStatus();
        project.setStatus(statusUpdate.getStatus());
        
        StatusHistory history = new StatusHistory();
        history.setProject(project);
        history.setOldStatus(oldStatus);
        history.setNewStatus(statusUpdate.getStatus());
        history.setUpdatedBy(admin);
        if ("REJECTED".equals(statusUpdate.getStatus()) && statusUpdate.getRejectionReason() != null) {
            history.setRejectionReason(statusUpdate.getRejectionReason());
        }
        statusHistoryRepository.save(history);
        
        project = projectRepository.save(project);
        
        notificationService.createNotification(
            project.getLoggedBy().getId(),
            project.getId(),
            null,
            "STATUS_UPDATE",
            "Project " + project.getProjectId() + " status updated to " + statusUpdate.getStatus()
        );
        
        logService.logAction(adminId, "UPDATE_STATUS", "PROJECT", projectId, 
            "Updated project status from " + oldStatus + " to " + statusUpdate.getStatus(), null);
        
        return convertToDTO(project);
    }
    
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setProjectId(project.getProjectId());
        dto.setProjectName(project.getProjectName());
        dto.setDepartment(project.getDepartment());
        dto.setBranch(project.getBranch());
        dto.setDescription(project.getDescription());
        dto.setPriorityLevel(project.getPriorityLevel() != null ? project.getPriorityLevel().name() : null);
        dto.setStatus(project.getStatus());
        dto.setLoggedBy(project.getLoggedBy().getFNumber());
        dto.setLoggedById(project.getLoggedBy().getId());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
