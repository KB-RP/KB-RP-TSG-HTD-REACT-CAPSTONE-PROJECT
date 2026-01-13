import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddCourse from '../childs/addCourse';
import { courseAPI } from '../../../utils/api/courseApi';

jest.mock('@ant-design/icons', () => ({}));

const mockResetFields = jest.fn();

jest.mock('antd', () => ({
  Card: ({ children }) => <div>{children}</div>,
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Form: {
    useForm: () => [{ resetFields: mockResetFields, setFieldsValue: jest.fn() }],
  },
}));

jest.mock('../../../utils/api/courseApi', () => ({
  courseAPI: {
    createCourse: jest.fn(),
  },
}));

jest.mock('../../../components/course/CourseForm', () => (props) => (
  <button
    onClick={() =>
      props.onFinish({
        id: 'temp',
        title: 'React',
        modules: [],
      })
    }
  >
    submit
  </button>
));

describe('AddCourse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockResetFields.mockClear();
  });

  test('creates course and resets form', async () => {
    const user = userEvent.setup();
    const { message } = require('antd');

    courseAPI.createCourse.mockResolvedValueOnce({});

    render(<AddCourse />);

    await user.click(screen.getByText('submit'));

    expect(courseAPI.createCourse).toHaveBeenCalledWith({
      title: 'React',
      modules: [],
    });
    expect(message.success).toHaveBeenCalledWith('Course created successfully!');
    expect(mockResetFields).toHaveBeenCalled();
  });

  test('shows error message on failure', async () => {
    const user = userEvent.setup();
    const { message } = require('antd');

    courseAPI.createCourse.mockRejectedValueOnce(new Error('fail'));

    render(<AddCourse />);

    await user.click(screen.getByText('submit'));

    expect(message.error).toHaveBeenCalledWith('Failed to create course');
  });
});
