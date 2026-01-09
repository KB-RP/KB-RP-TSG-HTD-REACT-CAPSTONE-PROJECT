// src/components/course/CourseCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({
  id,
  title,
  instructor,
  rating,
  students,
  duration,
  price,
  thumbnail,
  category,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    if (onClick) {
      onClick(e);
    } else {
      navigate(`/courses/${id}?tab=overview`);
    }
  };
  return (
    <article className="course-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="course-card__image">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div className="course-card__image--placeholder" />
        )}
        {category && <span className="course-card__badge">{category}</span>}
      </div>

      <div className="course-card__body">
        <header className="course-card__header">
          <h3 className="course-card__title">{title}</h3>
          {instructor && <p className="course-card__instructor">By {instructor}</p>}
        </header>

        <div className="course-card__meta">
          {(rating || rating === 0) && (
            <div className="course-card__rating" aria-label={`Rating ${rating}`}>
              <span className="course-card__star">★</span>
              <span className="course-card__rating-value">{Number(rating).toFixed(1)}</span>
            </div>
          )}

          <div className="course-card__stats">
            {typeof students === 'number' && (
              <span className="course-card__stat">{students.toLocaleString()} students </span>
            )}
            {duration && <span className="course-card__stat">{duration} hrs</span>}
          </div>
        </div>

        <footer className="course-card__footer">
          <div className="course-card__price">
            {price === 0 || price === '0' ? 'Free' : `$${Number(price).toFixed(2)}`}
          </div>
          <button 
            className="course-card__button" 
            type="button"
            onClick={handleViewDetails}
          >
            View details
          </button>
        </footer>
      </div>
    </article>
  );
};

export default CourseCard;
