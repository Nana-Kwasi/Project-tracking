package com.fnb.tracking.service;

import com.fnb.tracking.model.Notification;
import com.fnb.tracking.model.User;
import com.fnb.tracking.model.Project;
import com.fnb.tracking.model.ChangeRequest;
import com.fnb.tracking.repository.NotificationRepository;
import com.fnb.tracking.repository.UserRepository;
import com.fnb.tracking.repository.ProjectRepository;
import com.fnb.tracking.repository.ChangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ChangeRequestRepository changeRequestRepository;
    
    public void createNotification(Long userId, Long projectId, Long changeRequestId, String type, String message) {
        User user = userRepository.findById(userId).orElseThrow();
        
        Notification notification = new Notification();
        notification.setUser(user);
        if (projectId != null) {
            Project project = projectRepository.findById(projectId).orElse(null);
            notification.setProject(project);
        }
        if (changeRequestId != null) {
            ChangeRequest changeRequest = changeRequestRepository.findById(changeRequestId).orElse(null);
            notification.setChangeRequest(changeRequest);
        }
        notification.setNotificationType(type);
        notification.setMessage(message);
        
        notificationRepository.save(notification);
        
        // TODO: Integrate with external notification API
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }
}
