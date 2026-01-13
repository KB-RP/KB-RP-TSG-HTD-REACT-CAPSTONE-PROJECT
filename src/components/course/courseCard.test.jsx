import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CourseCard from './courseCard';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('CourseCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title, category, image, rating, students, duration and formatted price', () => {
    useNavigate.mockReturnValue(jest.fn());

    render(
      <CourseCard
        id={10}
        title="React"
        instructor="John"
        rating={4.5}
        students={1200}
        duration={5}
        price={19.9}
        thumbnail="thumb.png"
        category="Frontend"
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByAltText('React')).toHaveAttribute('src', 'thumb.png');

    expect(screen.getByLabelText('Rating 4.5')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('1,200 students')).toBeInTheDocument();
    expect(screen.getByText('5 hrs')).toBeInTheDocument();

    expect(screen.getByText('$19.90')).toBeInTheDocument();
    expect(screen.getByText(/view details/i, { selector: 'button' })).toBeInTheDocument();
  });

  test('shows placeholder when thumbnail is missing and shows Free when price is 0', () => {
    useNavigate.mockReturnValue(jest.fn());

    render(
      <CourseCard
        id={10}
        title="React"
        rating={0}
        students={0}
        price={0}
      />
    );

    expect(document.querySelector('.course-card__image--placeholder')).toBeTruthy();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  test('navigates to course detail when view details clicked and no onClick passed', async () => {
    const user = userEvent.setup();
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <CourseCard
        id={55}
        title="React"
        price={10}
      />
    );

    await user.click(screen.getByText(/view details/i, { selector: 'button' }));
    expect(navigate).toHaveBeenCalledWith('/courses/55?tab=overview');
  });

  test('calls onClick when provided instead of navigate', async () => {
    const user = userEvent.setup();
    const navigate = jest.fn();
    const onClick = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <CourseCard
        id={55}
        title="React"
        price={10}
        onClick={onClick}
      />
    );

    await user.click(screen.getByText(/view details/i, { selector: 'button' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });
});
