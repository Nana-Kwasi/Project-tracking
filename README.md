# FNB Project Tracking System

A full-stack project and change request tracking system with role-based access control.

## Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Spring Boot 3.2.0
- **Database**: PostgreSQL
- **Authentication**: JWT-based with role-based access control

## Features

### User Roles
- **Admin**: Full access to all screens and data
- **Normal User**: Access to Dashboard, Log Project, and Reports (own data only)

### Screens
1. **Login**: Secure authentication
2. **Dashboard**: Summary statistics and tables (role-based data)
3. **Log Project**: Create new project requests and change requests
4. **Projects** (Admin only): Manage all projects and change requests
5. **Users** (Admin only): Add, edit, and manage users
6. **Reports**: Filter and export reports
7. **Logs** (Admin only): System activity logs

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE fnb_tracking;
```

2. Run the schema script:
```bash
psql -U postgres -d fnb_tracking -f backend/src/main/resources/schema.sql
```

3. Update database credentials in `backend/src/main/resources/application.properties`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Default Credentials

A default admin user is created automatically:
- **Username**: `admin`
- **Password**: `admin123`

Default password for new users created via User Management: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Dashboard
- `GET /api/dashboard` - Get dashboard stats (role-based)

### Projects
- `GET /api/projects` - Get projects (role-based)
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}/status` - Update project status (Admin only)

### Change Requests
- `GET /api/change-requests` - Get change requests (role-based)
- `POST /api/change-requests` - Create change request
- `PUT /api/change-requests/{id}/status` - Update change request status (Admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user

### Logs (Admin only)
- `GET /api/logs` - Get system logs

## Color Palette

- Teal/Turquoise: #00A8A8 - #00B3B3
- Orange/Amber: #F9A01B - #FFA726
- Black: #000000
- White: #FFFFFF

## Project Status Options

- PENDING
- ACCEPTED
- REJECTED
- DISCUSSION
- DOCUMENTATION
- DEVELOPERS_DISCUSSION
- TESTING
- INT
- QA
- UAT
- QA_SIGN_OFF_IN_PROGRESS
- QA_SIGN_OFF_COMPLETE
- RELEASE_NOTES_PREPARED
- RELEASED_TO_PRODUCTION

## Branch Options

The system includes 11 predefined branch options as specified in the requirements.

## Notifications

Notification system is integrated and ready for external API integration. Notifications are triggered on:
- Project status updates
- Change request status updates
- Project rejection/approval

## Future Enhancements

- File attachment upload functionality
- PDF/Excel export for reports
- Advanced filtering and search
- Email notifications integration
- Real-time updates via WebSocket
