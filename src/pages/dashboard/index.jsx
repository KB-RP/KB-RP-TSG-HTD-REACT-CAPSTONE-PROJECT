// src/pages/dashboard/Home.jsx
import React, { useEffect, useState } from 'react';
import CourseCard from '../../components/course/courseCard';
import { courseAPI } from '../../utils/api/courseApi';

const DashboardHome = () => {
const [data , setData] = useState([]);

  const fetchAllCourses = async () => {
    const res = await courseAPI.getCourses();
    setData(res);
  }

  useEffect(()=>{
    fetchAllCourses();
  },[])

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Explore Courses</h1>
      </div>

      <div className="courses-section">
        <div className="courses-grid">
          {data?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
