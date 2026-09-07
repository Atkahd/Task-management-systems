#  Task Management System

##  Project Overview
The Task Management System is a robust, full-stack web application designed to help users efficiently track, organize, and manage their daily tasks. Built with a modern architecture, it features a responsive Next.js frontend seamlessly integrated with a secure Node.js backend. The application supports user authentication, task categorization, and live database updates to provide a seamless productivity experience.

##  Technology Stack
**Frontend**
* Next.js (App Router)
* React
* Tailwind CSS
* TypeScript

**Backend**
* Node.js
* Express.js
* JSON Web Tokens (JWT) for Authentication

**Database & Deployment**
* MongoDB Atlas (Cloud Database)
* Vercel (Frontend Hosting)
* Render (Backend API Hosting)

## Application Screenshots


* **Login & Authentication:** ![image alt](https://github.com/Atkahd/Task-management-systems/blob/63aac00dbd58d1aa49c05dcc559610f0afc57bca/Screenshot%202026-09-07%20181842.png)
* **Register & Authentication:** ![image alt](https://github.com/Atkahd/Task-management-systems/blob/63aac00dbd58d1aa49c05dcc559610f0afc57bca/Screenshot%202026-09-07%20181903.png)
* **User Dashboard:** ![image alt](https://github.com/Atkahd/Task-management-systems/blob/63aac00dbd58d1aa49c05dcc559610f0afc57bca/Screenshot%202026-09-07%20182021.png)
* **Task Management:** ![image alt](https://github.com/Atkahd/Task-management-systems/blob/63aac00dbd58d1aa49c05dcc559610f0afc57bca/Screenshot%202026-09-07%20182056.png)
* **Admin Dashboard:** ![image alt](https://github.com/Atkahd/Task-management-systems/blob/63aac00dbd58d1aa49c05dcc559610f0afc57bca/Screenshot%202026-09-07%20182146.png)
* **Admin View:** ![image alt](https://github.com/Atkahd/Task-management-systems/blob/63aac00dbd58d1aa49c05dcc559610f0afc57bca/Screenshot%202026-09-07%20182204.png)

##  Setup Instructions
Follow these steps to run the project locally on your machine.

**Prerequisites:**
* Node.js (v18 or higher)
* Git
* A MongoDB Atlas Cluster (or local MongoDB server)

**1. Clone the repository:**
```bash
git clone https://github.com/Atkahd/Task-management-systems.git
cd Task-management-systems
```

**2. Backend Setup:**
```bash
cd backend
npm install
npm run dev
```

**3. Frontend Setup:**
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

##  Environment Variable Documentation
To run this project securely, you must configure environment variables for both the frontend and backend. Create a `.env` file in the respective root directories.



## Deployment Information
This application is fully deployed and configured for production use. 

* **Frontend (Vercel):** [https://task-management-systems-smoky.vercel.app](https://task-management-systems-smoky.vercel.app)
* **Backend API (Render):** [https://task-management-systems-uvtc.onrender.com](https://task-management-systems-uvtc.onrender.com)



**Deployment Architecture Notes:**
* **CORS Policy:** The Render backend is strictly configured to accept cross-origin requests only from the deployed Vercel domain.
* **Database Network Access:** The MongoDB Atlas cluster utilizes a `0.0.0.0/0` IP whitelist to allow dynamic connections from the Render platform.
