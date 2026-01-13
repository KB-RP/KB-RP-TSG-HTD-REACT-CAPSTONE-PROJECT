import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { courseAPI } from '../../utils/api/courseApi';
import { FaPlay, FaClock, FaStar, FaUserGraduate, FaCertificate, FaMobileAlt, FaBookOpen } from 'react-icons/fa';
import '../../styles/course/courseDetail.scss';

import { Collapse, Tooltip , Flex } from 'antd';
const { Panel } = Collapse;
import { useSearchParams } from 'react-router-dom';
import { getYoutubeVideoId } from '../../utils/common/helper';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || '1';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [previewVideoId, setPreviewVideoId] = useState(null);

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    if (!urlTab) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('tab', activeTab);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', key);
      return next;
    });
  };

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

  const handleEnroll = async () => {
    const res = await courseAPI.enrollInCourse({ userId: user?.id, courseId: id });
    setIsEnrolled(true);
  };


  if (loading) {
    return <div className="course-loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="course-error">Course not found</div>;
  }

  const handleCoursePreview = () => {
    const link = course?.vdoLink || course?.videoLink;
    const videoId = getYoutubeVideoId(link);
    if (videoId) {
      setPreviewVideoId(videoId);
    }
  };


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
        <Tooltip title="Back to dashboard" placement="right">
          <button
            onClick={() => navigate('/dashboard')}
            className="back-button"
            aria-label="Back to dashboard"
          >
            &larr;
          </button>
        </Tooltip>

        <div className="course-layout">
          {/* Main Content */}
          <main className="course-main">
            <div className="course-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabChange('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => handleTabChange('curriculum')}
              >
                Curriculum
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => handleTabChange('reviews')}
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
                    {course?.modules?.slice(0, 2).map((module, idx) => (
                      <div key={idx} className="preview-module">
                        <h3>{module.title}</h3>
                        <div className="preview-lessons">
                          {module.lessons.slice(0, 3).map((lesson, lIdx) => (
                            <div
                              key={lIdx}
                              className="preview-lesson"
                              style={{ cursor: 'pointer' }}
                            >
                              <FaPlay className="play-icon" />
                              <span>{lesson.title}</span>
                              {lesson.preview && <span className="preview-badge">Preview</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="course-curriculum">
                  {course.modules?.map((module, mIdx) => (
                    <div key={mIdx} className="module">
                      <div className="lessons-accordion">
                        <Collapse
                          accordion
                          expandIconPlacement="right"
                        >
                          {module.lessons.map((lesson, lIdx) => (
                            <Panel
                              key={lIdx}
                              header={
                                <div
                                  className="lesson-header"
                                  onClick={(e) => {
                                    if (lesson.preview) {
                                      e.stopPropagation();
                                      handlePreviewClick(lesson);
                                    }
                                  }}
                                  style={{ cursor: lesson.preview ? 'pointer' : 'default' }}
                                >
                                  <div className="lesson-info">
                                    <FaPlay className="lesson-icon" />
                                    <span className="lesson-title">{lesson?.title}</span>
                                    {lesson.preview && <span className="preview-badge">Preview</span>}
                                  </div>
                                  <span className="lesson-duration">{lesson?.duration}m</span>
                                </div>
                              }
                            >
                              <div className="lesson-summary">
                                <p>{lesson?.summary || 'No summary available for this lesson.'}</p>
                              </div>
                            </Panel>
                          ))}
                        </Collapse>
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
              <div className="video-wrapper">
                {previewVideoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1`}
                    title="Course Preview"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Flex justify="center">
                      <div className="course-card">
                        <div className="video-wrapper">

                          <button className="preview-btn" onClick={handleCoursePreview}>
                            <FaPlay /> Preview this course
                          </button>
                        </div>
                      </div>
                    </Flex>

                  </>
                )}
              </div>
              <div className="pricing">
                <Flex justify="center">
                  <div className="price">
                    ${course.price?.toFixed(2)}
                    {course.originalPrice && (
                      <span className="original-price">
                        ${course.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Flex>

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