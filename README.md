# Practical 7: JWT Authentication and Middleware Pipeline

A full-stack Task Management application demonstrating **JWT Authentication**, custom **Express middleware pipelines** (authentication, task validation, request logging, centralized error handling), and a **React + Vite** frontend.

---

## 🚀 Features

- **User Authentication**: Secure user registration and login with password hashing via `bcryptjs` and token signing via `jsonwebtoken` (JWT).
- **Protected Routes**: Middleware verifies Bearer tokens on protected endpoints (`/me`, `/tasks`, etc.).
- **Data Validation Middleware**: Validates task creation/updates before database persistence.
- **Task Management (CRUD)**:
  - Create new tasks with title, description, and priority level (`low`, `medium`, `high`).
  - Read user-specific tasks (sorted by creation date).
  - Update task details or toggle completion status.
  - Delete existing tasks.
- **Modern Responsive Frontend**: Built with React 18 and Vite for fast development and rendering.

---

## 📂 Project Structure

```text
Practical-7/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication middleware
│   │   └── validate.js      # Task validation middleware
│   ├── models/
│   │   ├── Task.js          # Mongoose schema for tasks
│   │   └── User.js          # Mongoose schema for users
│   ├── .env                 # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express server entry point & API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Auth, TaskForm, TaskList, etc.)
│   │   ├── App.jsx          # Main application component
│   │   ├── api.js           # Fetch API service layer
│   │   ├── index.css        # Styling
│   │   └── main.jsx         # Vite entry file
│   ├── package.json         # Frontend dependencies & scripts
│   └── vite.config.js       # Vite configuration
└── README.md
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose**
- **JSON Web Tokens (JWT)** for stateless authentication
- **bcryptjs** for secure password hashing
- **dotenv** & **cors**

### Frontend
- **React 18**
- **Vite**

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The server will run on [http://localhost:5000](http://localhost:5000).*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run on [http://localhost:5173](http://localhost:5173).*

---

## 📡 API Endpoints

### Auth Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register a new user (`email`, `password`) | No |
| `POST` | `/login` | Authenticate user & receive JWT token | No |
| `GET` | `/me` | Get current logged-in user profile | Yes (Bearer Token) |

### Task Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/tasks` | Get all tasks belonging to authenticated user | Yes (Bearer Token) |
| `POST` | `/tasks` | Create a new task | Yes (Bearer Token) |
| `PUT` | `/tasks/:id` | Update an existing task | Yes (Bearer Token) |
| `DELETE` | `/tasks/:id` | Delete a task | Yes (Bearer Token) |
