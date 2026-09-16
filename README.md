# TaskFlow – Full Stack Task Management Web Application

A modern full-stack task management web application that allows users to register, log in, create tasks, update task details, track task status, set priorities and due dates, and monitor progress from one dashboard.

## Project Information

| Item | Details |
|---|---|
| Project Title | TaskFlow – Full Stack Task Management Web Application |
| Project Type | Individual Minor Project |
| Domain | Full Stack Development |
| Student | Krushna Manthalkar |

## Objective

The objective of this project is to demonstrate how the frontend, backend, REST APIs, authentication, database, and application logic work together in a complete full-stack web application.

**Application Flow:** User Interface → Frontend → API → Backend → Database → Response → Updated Interface

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected task APIs
- Logout functionality

### Task Management
- Create, view, edit, and delete tasks
- Mark tasks as Pending or Completed
- Task title and description
- Due dates
- Low, Medium, and High priority
- Categories
- Delete confirmation

### Dashboard
- Total, Pending, Completed, and High Priority counters
- Task completion progress
- Search tasks
- Filter by status
- Filter by priority
- Responsive task cards

## Technology Stack

**Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5  
**Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS, dotenv  
**Database:** MongoDB Atlas  
**Tools:** Visual Studio Code, Thunder Client, Git, GitHub

## Application Architecture

```text
Frontend (HTML + CSS + JavaScript)
                ↓
          REST API / Express
                ↓
      JWT Authentication Middleware
                ↓
             Mongoose
                ↓
          MongoDB Atlas
                ↓
       Response → Dashboard
```

## Project Structure

```text
KrushnaManthalkar_TaskManagement/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

> `.env` and `node_modules` are excluded from GitHub.

## Authentication Flow

```text
Register → MongoDB
             ↓
Login → Credentials Verified
             ↓
       JWT Token Generated
             ↓
       Protected Task APIs
             ↓
       Authentication Middleware
             ↓
       User-specific Tasks
```

## CRUD Operations

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| Create | POST | `/api/tasks` | Add a new task |
| Read | GET | `/api/tasks` | Get logged-in user's tasks |
| Update | PUT | `/api/tasks/:id` | Edit task or status |
| Delete | DELETE | `/api/tasks/:id` | Delete a task |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve user's tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Protected task APIs use:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Database

The application uses MongoDB Atlas.

### User Data
- Name
- Email
- Hashed password
- Created and updated timestamps

### Task Data
- User ID
- Title
- Description
- Due date
- Status
- Priority
- Category
- Created and updated timestamps

Each task is associated with its owner through `userId`.

## Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the backend

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create `backend/.env`:

```env
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
```

Never upload `.env` to GitHub.

### 5. Start the backend

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### 6. Run the frontend

Open `frontend/index.html` using VS Code Live Server or another local web server.

## Testing

The following major functions were tested:

- User registration
- User login
- JWT authentication
- Task creation
- Task retrieval
- Task editing
- Task deletion
- Pending/Completed status update
- Search
- Status filtering
- Priority filtering
- Dashboard counters
- Progress summary
- Logout
- Re-login and task persistence

API testing was performed using Thunder Client.

## Responsive Design

The application is designed for desktop, tablet, and mobile screens. Authentication pages, dashboard cards, filters, task cards, and action buttons adapt to smaller screens.

## Security

- Passwords are hashed using bcryptjs.
- JWT protects task APIs.
- Users can access only their own tasks.
- Database credentials are stored in environment variables.
- `.env` is excluded using `.gitignore`.

## Screenshots

Recommended screenshots for the project submission:

1. Login page
2. Registration page
3. Dashboard
4. Add Task form
5. Task list
6. Completed/Pending status
7. Search and filter functionality
8. CRUD/API testing evidence

Suggested folder:

```text
screenshots/
├── login.png
├── register.png
├── dashboard.png
├── add-task.png
└── crud-testing.png
```

## Future Enhancements

- Email task reminders
- Calendar integration
- Advanced analytics
- User profile management
- Drag-and-drop task organization
- Dark/light theme
- Notifications
- Cloud deployment

## Author

**Krushna Manthalkar**  
MCA Student | Full Stack Development

## Project Note

This project was developed as an educational Individual Minor Project for Full Stack Development and demonstrates frontend development, backend APIs, authentication, database integration, CRUD operations, and responsive web application design.
