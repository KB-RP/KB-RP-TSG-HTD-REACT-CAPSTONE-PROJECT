import React, { useEffect, useState } from 'react';
import { courseAPI } from '../../utils/api/courseApi';
import { useAuth } from '../../contexts';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiPlay } from 'react-icons/fi';
import './MyCourses.scss';

const MyCourses = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const res = await courseAPI.getEnrolledCourse(user?.id);
            setEnrolledCourses(res || []);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchEnrolledCourses();
        }
    }, [user?.id]);

    const formatDuration = (hours) => {
        return hours >= 1
            ? `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
            : `${Math.round(hours * 60)}m`;
    };

    if (loading) {
        return (
            <div className="my-courses loading">
                <div className="loading-spinner"></div>
                <p>Loading your courses...</p>
            </div>
        );
    }

    if (enrolledCourses.length === 0) {
        return (
            <div className="my-courses empty">
                <div className="empty-state">
                    <h2>No courses enrolled yet</h2>
                    <p>Explore our courses and start learning today!</p>
                    <Link to="/dashboard" className="browse-btn">
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="my-courses">
            <div className="page-header">
                <h1>My Learning</h1>
            </div>

            <div className="courses-grid">
                {enrolledCourses.map(({ course, progress = 0 }) => (
                    <div key={course.id} className="course-card">
                        <div className="course-thumbnail">
                            <img src={course.thumbnail} alt={course.title} />
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="progress-text">{Math.round(progress)}% complete</span>
                        </div>

                        <div className="course-content">
                            <div className="course-category">{course.category}</div>
                            <h3 className="course-title">
                                <Link to={`/courses/${course.id}`}>{course.title}</Link>
                            </h3>

                            <div className="course-meta">
                                <span className="meta-item">
                                    <FiStar className="meta-icon" />
                                    {course.rating} ({course.students.toLocaleString()})
                                </span>
                                <span className="meta-item">
                                    <FiUsers className="meta-icon" />
                                    {course.students.toLocaleString()} students
                                </span>
                                <span className="meta-item">
                                    <FiClock className="meta-icon" />
                                    {formatDuration(course.duration)}
                                </span>
                            </div>

                            <div className="course-actions">
                                <Link
                                    to={`/courses/${course.id}`}
                                    className="continue-btn"
                                >
                                    <FiPlay /> {progress > 0 ? 'Continue' : 'Start Learning'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;