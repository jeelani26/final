Client - FRONTEND  ----  SERVER - BACKEND


Online Course Selection Platform
Project Status: Deployment Ready (MERN Stack)
A professional web application designed to streamline the academic course registration process by automating conflict detection and providing role-based management. This project serves as a comprehensive demonstration of full-stack development principles.

Key Features:
Student Dashboard
Smart Filtering: Automatically filters the course catalog based on the student's academic year (determined from the first two digits of their ID).
Conflict Prevention: The backend actively blocks registration if the course time overlaps with an existing class, displaying a clear alert banner.
Visual Timetable: Displays registered courses on a sleek, professional weekly calendar (FullCalendar).
Registration Controls: Allows students to securely register for or drop courses.

Admin Dashboard:
Analytics: Shows real-time statistics (Total Courses, Total Enrollment, Avg. Capacity).
Management: Modal-based interface to Add and Delete courses.
Enrollment Tracking: Master table for viewing all current student registrations, with options to manually remove a student from a course.
Security: Integrated CAPTCHA on the login page for bot prevention.

Technology Stack
Component
Technology
Role
Frontend
React (Vite) + Material UI (MUI)
The user interface and client-side logic.

Backend
Node.js + Express.js
The RESTful API, business logic, and security checks.
Database
MongoDB
Stores all persistent data (Users, Courses, Enrollments).
Security
JWT, bcryptjs
Handles secure user authentication and password hashing.

Setup and Running Locally:
Prerequisites
Node.js (LTS version)
A MongoDB Atlas connection string.

1. Clone the repository
git clone [https://github.com/jeelani26/final.git](https://github.com/jeelani26/final.git)
cd final

2. Backend Configuration (/server)
cd server
npm install
CRITICAL: Create a file named .env in the /server folder and add your connection string:
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

3. Frontend Configuration (/client)
cd client
npm install
CRITICAL: Create a file named .env in the /client folder:
VITE_API_BASE_URL=http://localhost:5000
