# Full-Stack Task Management System

A full-stack, Trello-like Kanban board application designed with role-based access control (RBAC), secure RESTful APIs, and responsive drag-and-drop task management. 

Developed by Atheek Ahamed.

##  Deployment Information
* **Frontend Application (Live):** [Insert Vercel URL Here]
* **Backend API (Live):** [Insert Render URL Here]

### Administrator Login Credentials
To evaluate the administrator privileges (task reassignment, user management table), use the following seeded credentials:
* **Email:** admin@taskapp.com
* **Password:** SecureAdminPassword123!

---

## 🛠️ Technology Stack
### Frontend
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **State Management & Fetching:** `@tanstack/react-query`
* **Drag-and-Drop:** `@dnd-kit/core`
* **Form Validation:** `react-hook-form` & `zod`

### Backend
* **Environment:** Node.js
* **Framework:** Express.js
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing

### Database
* **Database:** MongoDB Atlas (Cloud)
* **ODM:** Mongoose

---

## 🔐 Environment Variable Documentation
To run this project locally, you must create two environment files.

**1. Backend Variables (`backend/.env`)**
```env
# Server Port
PORT=5000

# MongoDB Atlas Connection String
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret Key for Authentication
JWT_SECRET=your_super_secret_jwt_key

# Token Expiration Time
JWT_EXPIRES_IN=1d

# fronend link
FRONTEND_URL=http://localhost:3000