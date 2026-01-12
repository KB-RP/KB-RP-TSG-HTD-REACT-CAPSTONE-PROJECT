import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyCourses from '../index.jsx';
import { courseAPI } from '../../../utils/api/courseApi';
import { useAuth } from '../../../contexts';

/* ------------------ MOCKS ------------------ */
jest.mock('../../../utils/api/courseApi', () => ({
  courseAPI: {
    getEnrolledCourse: jest.fn(),
  },
}));

jest.mock('../../../contexts', () => ({
  useAuth: jest.fn(),
}));

/* ------------------ HELPERS ------------------ */
const renderComponent = () =>
  render(
    <MemoryRouter>
      <MyCourses />
    </MemoryRouter>
  );

describe('MyCourses Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ---------- TEST 1: Loading state ---------- */
  test('shows loading state initially', () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    // Never resolving promise → component stays in loading state
    courseAPI.getEnrolledCourse.mockReturnValue(
      new Promise(() => {})
    );

    renderComponent();

    expect(
      screen.getByText(/loading your courses/i)
    ).toBeInTheDocument();
  });

  /* ---------- TEST 2: Empty state ---------- */
  test('shows empty state when no courses are enrolled', async () => {
    useAuth.mockReturnValue({ user: { id: 1 } });
    courseAPI.getEnrolledCourse.mockResolvedValueOnce([]);

    renderComponent();

    expect(
      await screen.findByText(/no courses enrolled yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /browse courses/i })
    ).toBeInTheDocument();
  });

  /* ---------- TEST 3: API called with user id ---------- */
  test('calls getEnrolledCourse with correct user id', async () => {
    useAuth.mockReturnValue({ user: { id: 99 } });
    courseAPI.getEnrolledCourse.mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(courseAPI.getEnrolledCourse).toHaveBeenCalledWith(99);
    });
  });

  /* ---------- TEST 4: Render enrolled courses ---------- */
  test('renders enrolled course data correctly', async () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    courseAPI.getEnrolledCourse.mockResolvedValueOnce([
      {
        course: {
          id: '101',
          title: 'React Fundamentals',
          category: 'Frontend',
          thumbnail: 'react.png',
          rating: 4.5,
          students: 1200,
          duration: 2.5,
        },
        progress: 40,
      },
    ]);

    renderComponent();

    // Wait for success state
    expect(await screen.findByText(/my learning/i)).toBeInTheDocument();

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText(/4.5/i)).toBeInTheDocument();
    expect(screen.getByText(/1,200 students/i)).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  /* ---------- TEST 5: Continue button ---------- */
  test('shows "Continue" button when progress > 0', async () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    courseAPI.getEnrolledCourse.mockResolvedValueOnce([
      {
        course: {
          id: '102',
          title: 'Advanced React',
          category: 'Frontend',
          thumbnail: 'adv-react.png',
          rating: 4.8,
          students: 800,
          duration: 1.5,
        },
        progress: 20,
      },
    ]);

    renderComponent();

    expect(
      await screen.findByText(/continue/i)
    ).toBeInTheDocument();
  });

  /* ---------- TEST 6: Start Learning button ---------- */
  test('shows "Start Learning" button when progress is 0', async () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    courseAPI.getEnrolledCourse.mockResolvedValueOnce([
      {
        course: {
          id: '103',
          title: 'JavaScript Basics',
          category: 'Programming',
          thumbnail: 'js.png',
          rating: 4.2,
          students: 500,
          duration: 0.5,
        },
        progress: 0,
      },
    ]);

    renderComponent();

    expect(
      await screen.findByText(/start learning/i)
    ).toBeInTheDocument();

    // Check duration formatting for <1 hour
    expect(screen.getByText('30m')).toBeInTheDocument();
  });

  /* ---------- TEST 7: Handles API error ---------- */
  test('shows loading false even if API fails', async () => {
    useAuth.mockReturnValue({ user: { id: 1 } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    courseAPI.getEnrolledCourse.mockRejectedValueOnce(new Error('API error'));

    renderComponent();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching enrolled courses:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  /* ---------- TEST 8: No user → no API call ---------- */
  test('does not call API if user is not defined', async () => {
    useAuth.mockReturnValue({ user: null });

    renderComponent();

    expect(courseAPI.getEnrolledCourse).not.toHaveBeenCalled();
  });
});
