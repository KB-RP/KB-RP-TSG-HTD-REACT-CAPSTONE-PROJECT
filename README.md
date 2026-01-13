# Learning Management System (LMS)

A comprehensive Learning Management System built with React (frontend) and JSON Server (backend) for managing online courses, user authentication, and course enrollment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Management
- User registration and login
- Role-based access control (Admin and Student roles)
- JWT-based authentication
- Profile management

### Course Management
- Browse and search courses
- Detailed course pages with modules and lessons
- Course enrollment
- Admin panel for creating, editing, and deleting courses
- Course filtering by category, level, and rating

### Dashboard
- Personalized dashboard for students
- Course progress tracking
- My Courses section
- Admin settings for course management

### UI/UX
- Responsive design using Ant Design
- Modern React components with hooks
- Lazy loading for performance
- SCSS for styling

## Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **Axios** - HTTP client
- **SASS** - CSS preprocessor
- **Jest** - Testing framework
- **React Testing Library** - Testing utilities

### Backend
- **JSON Server** - REST API mock server
- **JSON Server Auth** - Authentication middleware

### Development Tools
- **ESLint** - Code linting
- **Babel** - JavaScript transpiler
- **Vite Plugin React** - React integration for Vite

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

### Backend Setup

1. Navigate to the root directory:
   ```bash
   cd "c:\HTD\Capstone Project"
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the JSON Server:
   ```bash
   npm run start:api
   ```
   The server will run on `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd LMS/lms
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Usage

### Running the Application

1. Start the backend server first (as described above).
2. Start the frontend development server.
3. Open your browser and navigate to `http://localhost:5173`.

### User Roles

- **Student**: Can browse courses, enroll, view enrolled courses, and access dashboard.
- **Admin**: Has all student permissions plus the ability to create, edit, and delete courses via the admin settings.

### Default Users

The application comes with pre-configured users:

- **Admin**: 
  - Email: `kaushikbhowmick@rightpoint.com`
  - Password: `123456`
- **Student**:
  - Email: `testuser@emaple.com`
  - Password: `123456`

## API Documentation

The backend uses JSON Server with authentication. Base URL: `http://localhost:8000`

### Authentication Endpoints

- `POST /login` - User login
- `POST /register` - User registration
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - User logout

### Course Endpoints

- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create new course (Admin only)
- `PUT /courses/:id` - Update course (Admin only)
- `DELETE /courses/:id` - Delete course (Admin only)

### Enrollment Endpoints

- `POST /enrollments` - Enroll in a course
- `GET /enrollments?userId=:id` - Get enrolled courses for a user

### Data Models

#### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "password": "hashed_password",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student" | "admin"
}
```

#### Course
```json
{
  "id": 1,
  "title": "Course Title",
  "instructor": "Instructor Name",
  "rating": 4.7,
  "students": 1245,
  "duration": 12,
  "level": "Intermediate",
  "category": "Web Development",
  "thumbnail": "image_url",
  "vdoLink": "video_url",
  "price": 89.99,
  "originalPrice": 129.99,
  "description": "Course description",
  "learningObjectives": ["Objective 1", "Objective 2"],
  "modules": [
    {
      "id": "1",
      "title": "Module Title",
      "description": "Module description",
      "lessons": [
        {
          "id": "1-1",
          "title": "Lesson Title",
          "duration": 15,
          "type": "video",
          "summary": "Lesson summary"
        }
      ]
    }
  ]
}
```

## Project Structure

```
Capstone Project/
├── db.json                          # JSON Server database
├── server.js                        # JSON Server configuration
├── package.json                     # Backend dependencies
└── LMS/
    └── lms/
        ├── public/                  # Static assets
        ├── src/
        │   ├── App.jsx              # Main app component
        │   ├── main.jsx             # App entry point
        │   ├── App.css              # Global styles
        │   ├── components/          # Reusable UI components
        │   │   ├── common/          # Common components (AdminRoute)
        │   │   ├── course/          # Course-related components
        │   │   ├── layout/          # Layout components (Navbar, Sidebar)
        │   │   └── ui/              # UI components
        │   ├── contexts/            # React contexts
        │   │   ├── auth/            # Authentication context
        │   │   └── index.js         # Context exports
        │   ├── lib/                 # Utility libraries
        │   ├── modal/               # Modal components
        │   ├── pages/               # Page components
        │   │   ├── dashboard/       # Dashboard page
        │   │   ├── myCourses/       # My Courses page
        │   │   ├── adminSettings/   # Admin settings page
        │   │   ├── courseDetail/    # Course detail page
        │   │   ├── signIn/          # Sign in page
        │   │   ├── signUp/          # Sign up page
        │   │   └── layout.jsx       # Main layout
        │   ├── styles/              # SCSS stylesheets
        │   │   ├── common/          # Common styles
        │   │   ├── course/          # Course styles
        │   │   ├── dashboard/       # Dashboard styles
        │   │   └── auth/            # Auth styles
        │   └── utils/               # Utility functions
        │       ├── api/             # API client and endpoints
        │       └── common/          # Common utilities
        ├── __mocks__/               # Jest mocks
        ├── coverage/                # Test coverage reports
        ├── package.json             # Frontend dependencies
        ├── vite.config.js           # Vite configuration
        ├── babel.config.cjs         # Babel configuration
        ├── eslint.config.js         # ESLint configuration
        ├── jest.config.cjs          # Jest configuration
        └── README.md                # This file
```

## Testing

The project includes comprehensive testing setup:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

- Unit tests for components, hooks, and utilities
- Integration tests for API calls
- Test coverage reporting
- Mock implementations for external dependencies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is a capstone project demonstrating full-stack development skills with modern React and REST API integration. 
