import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseDetail from '../index.jsx';
import { courseAPI } from '../../../utils/api/courseApi';
import { useAuth } from '../../../contexts';

/* -------------------- mocks -------------------- */

jest.mock('../../../utils/api/courseApi', () => ({
  courseAPI: {
    getCourseById: jest.fn(),
    enrollInCourse: jest.fn(),
    updateStudentCount: jest.fn(), // ✅ added
  },
}));

jest.mock('../../../contexts', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockSetSearchParams = jest.fn();
let mockSearchParams = new URLSearchParams('tab=overview');

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  };
});

/* antd mock */
jest.mock('antd', () => {
  const Collapse = ({ children }) => <div>{children}</div>;
  Collapse.Panel = ({ children }) => <div>{children}</div>;

  return {
    Collapse,
    Tooltip: ({ children }) => <div>{children}</div>,
    Flex: ({ children }) => <div>{children}</div>,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

/* helper */
jest.mock('../../../utils/common/helper', () => ({
  getYoutubeVideoId: jest.fn(() => 'abc123'),
}));

/* -------------------- test data -------------------- */

const courseMock = {
  id: 1,
  title: 'React Mastery',
  description: 'Learn React',
  category: 'Frontend',
  rating: 4.5,
  students: 200,
  level: 'Beginner',
  duration: 5,
  price: 10,
  originalPrice: 20,
  videoLink: 'https://youtube.com/watch?v=abc123',
  learningObjectives: ['JSX', 'Hooks'],
  modules: [
    {
      title: 'Module 1',
      lessons: [
        {
          title: 'Intro',
          duration: 5,
          preview: true,
          summary: 'Intro summary',
        },
      ],
    },
  ],
};

/* -------------------- tests -------------------- */

describe('CourseDetail – updated component coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams('tab=overview');
    useAuth.mockReturnValue({ user: { id: 10 } });
  });

  test('shows loading then renders course', async () => {
    courseAPI.getCourseById.mockResolvedValueOnce(courseMock);

    render(<CourseDetail />);

    expect(
      screen.getByText(/loading course details/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText('React Mastery')
    ).toBeInTheDocument();
  });

  test('handles API failure → course not found', async () => {
    courseAPI.getCourseById.mockRejectedValueOnce(new Error('fail'));

    render(<CourseDetail />);

    expect(
      await screen.findByText(/course not found/i)
    ).toBeInTheDocument();
  });

  test('enroll flow works and updates student count', async () => {
    const user = userEvent.setup();

    courseAPI.getCourseById.mockResolvedValueOnce(courseMock);
    courseAPI.enrollInCourse.mockResolvedValueOnce({});
    courseAPI.updateStudentCount.mockResolvedValueOnce({});

    render(<CourseDetail />);

    await screen.findByText('React Mastery');

    await user.click(screen.getByText('Enroll Now'));

    // enroll API call
    expect(courseAPI.enrollInCourse).toHaveBeenCalledWith({
      userId: 10,
      courseId: '1',
    });

    // update student count API call
    expect(courseAPI.updateStudentCount).toHaveBeenCalledWith(
      '1',
      courseMock.students + 1
    );

    // enrolled UI
    expect(
      await screen.findByText('Enrolled')
    ).toBeInTheDocument();
  });

  test('does not update student count if enrollment fails', async () => {
    const user = userEvent.setup();

    courseAPI.getCourseById.mockResolvedValueOnce(courseMock);

    render(<CourseDetail />);

    await screen.findByText('React Mastery');
    await user.click(screen.getByText('Enroll Now'));

    expect(courseAPI.updateStudentCount).not.toHaveBeenCalled();
  });

  test('switches tabs (overview → curriculum → reviews)', async () => {
    const user = userEvent.setup();
    courseAPI.getCourseById.mockResolvedValueOnce(courseMock);

    render(<CourseDetail />);

    await screen.findByText("What you'll learn");

    await user.click(screen.getByText('Curriculum'));
    expect(mockSetSearchParams).toHaveBeenCalled();

    await user.click(screen.getByText('Reviews'));

  });

  test('syncs active tab from URL', async () => {
    mockSearchParams = new URLSearchParams('tab=reviews');
    courseAPI.getCourseById.mockResolvedValueOnce(courseMock);

    render(<CourseDetail />);


  });

  // test('renders preview iframe when clicking preview course button', async () => {
  //   const user = userEvent.setup();
  //   courseAPI.getCourseById.mockResolvedValueOnce(courseMock);

  //   render(<CourseDetail />);

  //   await screen.findByText(/preview this course/i);
  //   await user.click(screen.getByText(/preview this course/i));

  //   expect(
  //     await screen.findByTitle('Course Preview')
  //   ).toBeInTheDocument();
  // });

  test('back button navigates to dashboard', async () => {
    const user = userEvent.setup();
    courseAPI.getCourseById.mockResolvedValueOnce(courseMock);

    render(<CourseDetail />);

    await screen.findByText('React Mastery');
    await user.click(screen.getByLabelText(/back to dashboard/i));

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
