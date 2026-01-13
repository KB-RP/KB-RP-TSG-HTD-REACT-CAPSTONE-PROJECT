import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ManageCourses from '../childs/manageCourses';
import { courseAPI } from '../../../utils/api/courseApi';

jest.mock('@ant-design/icons', () => ({
  EditOutlined: () => null,
  DeleteOutlined: () => null,
  SearchOutlined: () => null,
  InfoCircleOutlined: () => null,
}));

jest.mock('../../../utils/api/courseApi', () => ({
  courseAPI: {
    getCourses: jest.fn(),
    deleteCourse: jest.fn(),
  },
}));

jest.mock('../../../modal/editCourse', () => (props) => (
  <div data-testid="edit-modal" data-visible={String(!!props.editFormVisible)} />
));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

jest.mock('antd', () => {
  const message = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const Button = (props) => {
    const testId = props.icon?.type?.displayName || props.icon?.type?.name;
    return (
      <button
        data-testid={testId || undefined}
        onClick={props.onClick}
      >
        {props.children || testId || 'button'}
      </button>
    );
  };

  const Tooltip = ({ children }) => <>{children}</>;
  const Space = ({ children }) => <div>{children}</div>;

  const Popconfirm = ({ children, onConfirm }) => (
    <div onClick={onConfirm}>{children}</div>
  );

  const Input = {
    Search: ({ placeholder, onChange, onSearch }) => (
      <input
        aria-label={placeholder}
        onChange={(e) => onChange?.(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch?.(e.currentTarget.value);
        }}
      />
    ),
  };

  const Table = ({ columns, dataSource }) => (
    <div>
      {dataSource.map((row) => (
        <div key={row.id} data-testid="row">
          {columns.map((col, idx) => (
            <div key={idx}>
              {col.render
                ? col.render(row[col.dataIndex], row)
                : row[col.dataIndex]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const Tag = ({ children }) => <span>{children}</span>;
  const Typography = { Text: ({ children }) => <span>{children}</span> };

  return {
    Table,
    Space,
    Button,
    Input,
    Modal: ({ children }) => <div>{children}</div>,
    message,
    Popconfirm,
    Tag,
    Tooltip,
    Typography,
  };
});

describe('ManageCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays courses', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      {
        id: 1,
        title: 'React',
        instructor: 'John',
        category: 'Frontend',
        rating: 4.5,
        students: 1000,
        price: 10,
        originalPrice: 20,
        duration: 5,
        modules: [{ lessons: [{}, {}] }],
      },
    ]);

    render(<ManageCourses />);

    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalledTimes(1));

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('4.5/5.0')).toBeInTheDocument();
  });

  test('filters results when searching', async () => {
    const user = userEvent.setup();

    courseAPI.getCourses.mockResolvedValueOnce([
      {
        id: 1,
        title: 'React',
        instructor: 'John',
        category: 'Frontend',
        rating: 4.5,
        students: 1000,
        price: 10,
        originalPrice: 10,
        duration: 5,
        modules: [{ lessons: [] }],
      },
      {
        id: 2,
        title: 'Node',
        instructor: 'Bob',
        category: 'Backend',
        rating: 4,
        students: 100,
        price: 5,
        originalPrice: 5,
        duration: 2,
        modules: [{ lessons: [] }],
      },
    ]);

    render(<ManageCourses />);
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalledTimes(1));

    await user.type(screen.getByLabelText(/search courses, instructors/i), 'react');

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Node')).not.toBeInTheDocument();
  });

  test('deletes course on confirm', async () => {
    const user = userEvent.setup();
    const { message } = require('antd');

    courseAPI.getCourses.mockResolvedValueOnce([
      {
        id: 1,
        title: 'React',
        instructor: 'John',
        category: 'Frontend',
        rating: 4.5,
        students: 1000,
        price: 10,
        originalPrice: 10,
        duration: 5,
        modules: [{ lessons: [] }],
      },
    ]);

    courseAPI.deleteCourse.mockResolvedValueOnce({});

    render(<ManageCourses />);
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalledTimes(1));

    // Popconfirm wrapper triggers onConfirm when clicked (mock)
    const deleteBtn = screen.getByTestId('DeleteOutlined');
    await user.click(deleteBtn);

    await waitFor(() => expect(courseAPI.deleteCourse).toHaveBeenCalledWith(1));
    expect(message.success).toHaveBeenCalledWith('Course deleted successfully');
  });
});
