// src/pages/dashboard/Home.jsx
import React from 'react';
import CourseCard from '../../components/course/CourseCard';

const sampleCourses = [
  {
    id: 1,
    title: 'Complete React Developer',
    instructor: 'John Doe',
    rating: 4.7,
    students: 12453,
    duration: '24h 30m',
    price: 89.99,
    thumbnail: 'https://via.placeholder.com/640x360?text=React+Course',
    category: 'Development',
  },
  {
    id: 2,
    title: 'Advanced JavaScript Patterns',
    instructor: 'Jane Smith',
    rating: 4.8,
    students: 8765,
    duration: '18h 15m',
    price: 74.99,
    thumbnail: 'https://via.placeholder.com/640x360?text=JavaScript+Course',
    category: 'Development',
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Alex Johnson',
    rating: 4.6,
    students: 5432,
    duration: '15h 45m',
    price: 59.99,
    thumbnail: 'https://via.placeholder.com/640x360?text=UI%2FUX+Course',
    category: 'Design',
  },
  {
    id: 4,
    title: 'Python for Data Science',
    instructor: 'Emily Clark',
    rating: 4.7,
    students: 15890,
    duration: '22h 10m',
    price: 69.99,
    thumbnail: 'https://via.placeholder.com/640x360?text=Python+Course',
    category: 'Data',
  },
];

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Explore Courses</h1>
        <p className="dashboard-subtitle">Handpicked recommendations for you</p>
      </div>

      <div className="courses-section">
        <div className="section-header">
          <h2>Recommended</h2>
        </div>

        <div className="courses-grid">
          {sampleCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
