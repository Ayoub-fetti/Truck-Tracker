# Truck-Tracker

Truck-Tracker is a fleet management system designed to manage trucks, trailers, trips, maintenance, fuel logs, and more. It includes a backend built with Node.js and Express, and a frontend built with React. The project is containerized using Docker for easy deployment.

---

## Project Structure

```
.
├── backend/       # Backend API built with Node.js and Express
├── frontend/      # Frontend application built with React
├── docker-compose.yml
├── README.md
```

---

## Backend

### Features
- RESTful API for managing trucks, trailers, trips, maintenance, tires, and fuel logs.
- Authentication and authorization with JWT.
- Role-based access control (Admin, Driver).
- MongoDB as the database.

### Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/truck-tracker
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. (Optional) Seed the database with an admin user:
   ```bash
   npm run seed
   ```

---

## Frontend

### Features
- Admin dashboard for managing trucks, trailers, trips, maintenance, tires, and fuel logs.
- Driver interface for viewing assigned trips and trip details.
- Responsive design using Tailwind CSS.

### Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

## Docker

### Setup

1. Ensure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

4. Stop the containers:
   ```bash
   docker-compose down
   ```

---

## License

This project is licensed under the MIT License.