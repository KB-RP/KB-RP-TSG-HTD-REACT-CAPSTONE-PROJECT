import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { courseAPI } from '../../utils/api/courseApi';
import { FaPlay, FaClock, FaStar, FaUserGraduate, FaCertificate, FaMobileAlt, FaBookOpen } from 'react-icons/fa';
import './CourseDetail.scss';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await courseAPI.getCourseById(id);
        setCourse(res);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/courses/${id}` } });
      return;
    }
    // Implement enrollment logic
    setIsEnrolled(true);
  };

  if (loading) {
    return <div className="course-loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="course-error">Course not found</div>;
  }

  return (
    <div className="course-detail">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="container">
          <div className="course-hero__content">
            <span className="course-category">{course.category}</span>
            <h1 className="course-title">{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>
            
            <div className="course-meta">
              <div className="meta-item">
                <FaStar className="meta-icon" />
                <span>{course.rating} ({course.students?.toLocaleString()} students)</span>
              </div>
              <div className="meta-item">
                <FaUserGraduate className="meta-icon" />
                <span>{course.level} Level</span>
              </div>
              <div className="meta-item">
                <FaClock className="meta-icon" />
                <span>{course.duration} hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container course-container">
        <div className="course-layout">
          {/* Main Content */}
          <main className="course-main">
            <div className="course-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Curriculum
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="course-overview">
                  <h2>What you'll learn</h2>
                  <div className="learning-objectives">
                    {course.learningObjectives?.map((objective, index) => (
                      <div key={index} className="objective-item">
                        <FaBookOpen className="objective-icon" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>

                  <h2>Course Content</h2>
                  <div className="course-preview">
                    {course.modules?.slice(0, 2).map((module, idx) => (
                      <div key={idx} className="preview-module">
                        <h3>{module.title}</h3>
                        <div className="preview-lessons">
                          {module.lessons.slice(0, 3).map((lesson, lIdx) => (
                            <div key={lIdx} className="preview-lesson">
                              <FaPlay className="play-icon" />
                              <span>{lesson.title}</span>
                              {lesson.preview && <span className="preview-badge">Preview</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="view-all-btn">View all content</button>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="course-curriculum">
                  {course.modules?.map((module, mIdx) => (
                    <div key={mIdx} className="module">
                      <div className="module-header">
                        <h3>{module.title}</h3>
                        <span>{module.lessons.length} lessons • {Math.floor(module.duration / 60)}h {module.duration % 60}m</span>
                      </div>
                      <div className="lessons-list">
                        {module.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="lesson-item">
                            <div className="lesson-info">
                              <FaPlay className="lesson-icon" />
                              <span className="lesson-title">{lesson.title}</span>
                              {lesson.preview && <span className="preview-badge">Preview</span>}
                            </div>
                            <span className="lesson-duration">{lesson.duration}m</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="course-reviews">
                  <div className="reviews-header">
                    <div className="rating-overview">
                      <div className="rating-number">{course.rating}</div>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`star ${i < Math.floor(course.rating) ? 'active' : ''}`} 
                          />
                        ))}
                      </div>
                      <div className="rating-count">Course Rating • {course.students?.toLocaleString()} students</div>
                    </div>
                  </div>
                  <div className="reviews-list">
                    {/* Reviews would be mapped here */}
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="course-sidebar">
            <div className="course-card">
              <div className="course-preview">
                <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                <button className="preview-btn">
                  <FaPlay /> Preview this course
                </button>
              </div>

              <div className="pricing">
                <div className="price">
                  ${course.price?.toFixed(2)}
                  {course.originalPrice && (
                    <span className="original-price">${course.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <button 
                  className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                </button>
              </div>

              <div className="course-features">
                <div className="feature">
                  <FaMobileAlt className="feature-icon" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="feature">
                  <FaCertificate className="feature-icon" />
                  <span>Certificate of completion</span>
                </div>
                <div className="feature">
                  <FaClock className="feature-icon" />
                  <span>Full lifetime access</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;