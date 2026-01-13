package com.fnb.tracking.service;

import com.fnb.tracking.dto.ChangeRequestDTO;
import com.fnb.tracking.dto.DashboardStatsDTO;
import com.fnb.tracking.dto.ProjectDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private ChangeRequestService changeRequestService;
    
    public DashboardStatsDTO getAdminDashboard() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        List<ProjectDTO> allProjects = projectService.getAllProjects();
        List<ChangeRequestDTO> allChangeRequests = changeRequestService.getAllChangeRequests();
        
        stats.setTotalProjects((long) allProjects.size());
        stats.setNewProjectRequests((long) allProjects.size());
        stats.setChangeRequests((long) allChangeRequests.size());
        stats.setNewProjectRequestsList(allProjects);
        stats.setChangeRequestsList(allChangeRequests);
        
        return stats;
    }
    
    public DashboardStatsDTO getUserDashboard(Long userId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        List<ProjectDTO> userProjects = projectService.getUserProjects(userId);
        List<ChangeRequestDTO> userChangeRequests = changeRequestService.getUserChangeRequests(userId);
        
        stats.setTotalProjects((long) userProjects.size());
        stats.setNewProjectRequests((long) userProjects.size());
        stats.setChangeRequests((long) userChangeRequests.size());
        stats.setNewProjectRequestsList(userProjects);
        stats.setChangeRequestsList(userChangeRequests);
        
        return stats;
    }
}
