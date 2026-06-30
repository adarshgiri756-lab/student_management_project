# Student Task Dashboard Management System

A production-style MERN student task dashboard for college projects and portfolio work. It includes JWT authentication, admin/student roles, task management, dashboards, search, filters, statistics, password changes, and responsive React UI.

## Tech Stack

- Frontend: React, Vite, Axios, React Router DOM, Context API, plain CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcrypt

## Folder Structure

```text
student-dashboard/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    server.js
    .env.example
  client/
    src/
      components/
      context/
      pages/
      services/
      App.jsx
      main.jsx
```

## MongoDB Setup

Install MongoDB locally or create a MongoDB Atlas cluster. Copy the connection string into `backend/.env`.

The default admin account is seeded automatically on first backend startup:

- Student ID: `1001`
- Password: `123456`

## Environment Variables

Create `backend/.env` using `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_dashboard
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

## Installation

```bash
npm install
npm run install:all
```

## Running the App

Start both frontend and backend:

```bash
npm run dev
```

Or run separately:

```bash
npm run server
npm run client
```

Backend runs on `http://localhost:5000`.
Frontend runs on `http://localhost:5173`.

## API Documentation

All private routes require:

```http
Authorization: Bearer <jwt-token>
```

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | Login with studentId and password |
| POST | `/api/auth/logout` | Private | Client logout helper |
| POST | `/api/auth/change-password` | Private | Change current user's password |

### Students

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/students` | Admin | List students with search/filter |
| POST | `/api/students` | Admin | Create student |
| PUT | `/api/students/:id` | Admin | Edit student |
| DELETE | `/api/students/:id` | Admin | Delete student |
| PATCH | `/api/students/:id/reset-password` | Admin | Reset student password |

### Tasks

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/tasks` | Admin/Student | Admin sees all, students see own tasks |
| POST | `/api/tasks` | Admin | Assign task |
| PUT | `/api/tasks/:id` | Admin/Owner | Edit task or update status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET | `/api/tasks/student/:studentId` | Admin/Owner | Get tasks for a student |

### Statistics

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/stats` | Private | Role-aware dashboard statistics |

## Notes

- Passwords are always hashed using bcrypt.
- Application data is stored in MongoDB only.
- The frontend stores only the JWT token in local storage.
- Expired or invalid tokens automatically redirect to the login page.
