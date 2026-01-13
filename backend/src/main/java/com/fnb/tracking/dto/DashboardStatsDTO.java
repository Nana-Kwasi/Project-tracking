package com.fnb.tracking.dto;

import java.util.List;

public class DashboardStatsDTO {
    private Long totalProjects;
    private Long newProjectRequests;
    private Long changeRequests;
    private Long projectsByStatus;
    private List<ProjectDTO> newProjectRequestsList;
    private List<ChangeRequestDTO> changeRequestsList;
    
    public DashboardStatsDTO() {}
    
    // Getters and Setters
    public Long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(Long totalProjects) { this.totalProjects = totalProjects; }
    public Long getNewProjectRequests() { return newProjectRequests; }
    public void setNewProjectRequests(Long newProjectRequests) { this.newProjectRequests = newProjectRequests; }
    public Long getChangeRequests() { return changeRequests; }
    public void setChangeRequests(Long changeRequests) { this.changeRequests = changeRequests; }
    public Long getProjectsByStatus() { return projectsByStatus; }
    public void setProjectsByStatus(Long projectsByStatus) { this.projectsByStatus = projectsByStatus; }
    public List<ProjectDTO> getNewProjectRequestsList() { return newProjectRequestsList; }
    public void setNewProjectRequestsList(List<ProjectDTO> newProjectRequestsList) { this.newProjectRequestsList = newProjectRequestsList; }
    public List<ChangeRequestDTO> getChangeRequestsList() { return changeRequestsList; }
    public void setChangeRequestsList(List<ChangeRequestDTO> changeRequestsList) { this.changeRequestsList = changeRequestsList; }
}
