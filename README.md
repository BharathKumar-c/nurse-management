# Nurse Management System

A full-stack web application for managing nurse records with CRUD operations, built using React.js, Node.js, and MySQL.

## Tech Stack

- **Frontend**: React.js, TailwindCSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL (XAMPP)

## Project Structure

```
nurse-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── nurseController.js
│   ├── routes/
│   │   └── nurseRoutes.js
│   ├── services/
│   │   └── exportService.js
│   ├── middleware/
│   │   └── validation.js
│   ├── server.js
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (XAMPP)
- Git

### Database Setup

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin or MySQL command line
3. Run the SQL script from `database/schema.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS nurse_management;
   USE nurse_management;
   -- Then run the CREATE TABLE statement
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `env.example`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=nurse_management
   ```

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, for custom API URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Development Stages

This project is being developed in multiple stages:

### Stage 1: Project Setup ✅
- Backend and frontend folder structure
- Initial configuration files
- Basic startup scripts
- Database schema

### Stage 2: API Implementation ✅
- Fully functional REST API endpoints with validation
- Search and sorting using query parameters
- CSV/XLSX export services
- Postman collection + API documentation

### Stage 3: Frontend Implementation (Pending)
- Complete UI components
- Table with sorting functionality
- Add/Edit modal
- Search functionality
- Download buttons

## API Endpoints

See `API_DOCUMENTATION.md` for full request/response samples.

- `GET /api/nurses` - Get all nurses (supports `search`, `sortField`, `sortOrder`)
- `GET /api/nurses/:id` - Get nurse by ID
- `POST /api/nurses` - Create new nurse (age auto-calculated from DOB)
- `PUT /api/nurses/:id` - Update nurse
- `DELETE /api/nurses/:id` - Delete nurse
- `GET /api/nurses/export/csv` - Export as CSV
- `GET /api/nurses/export/xlsx` - Export as XLSX

### Postman Collection
- Import `postman/NurseManagement.postman_collection.json`
- Set the `base_url` variable to `http://localhost:5000`

## Features

- ✅ CRUD operations for nurse records
- ✅ MySQL database integration
- ✅ RESTful API design with validation
- ✅ API search + sorting
- ✅ CSV/XLSX export services
- 🔄 Frontend table sorting (UI)
- 🔄 Frontend search UX
- 🔄 Modal for add/edit (frontend)

## License

ISC
