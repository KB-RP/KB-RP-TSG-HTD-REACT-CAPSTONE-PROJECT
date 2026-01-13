import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CourseAnalytics from '../childs/courseAnalytics';
import { courseAPI } from '../../../utils/api/courseApi';

/* ------------------ Mocks ------------------ */

jest.mock('@ant-design/icons', () => ({
  DownloadOutlined: () => null,
  EyeOutlined: () => null,
}));

jest.mock('../../../utils/api/courseApi', () => ({
  courseAPI: {
    getCourses: jest.fn(),
  },
}));

jest.mock('html-to-image', () => ({
  toPng: jest.fn(),
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive">{children}</div>
  ),
  BarChart: ({ children }) => (
    <div data-testid="barchart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

jest.mock('antd', () => {
  const message = {
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  };

  return {
    Card: ({ children }) => <div>{children}</div>,
    Select: ({ value, options = [], onChange, mode }) => (
      <select
        aria-label={mode === 'multiple' ? 'courses' : 'kpi'}
        multiple={mode === 'multiple'}
        value={value}
        onChange={(e) => {
          if (mode === 'multiple') {
            const vals = Array.from(e.target.selectedOptions).map(
              (o) => o.value
            );
            onChange(vals);
          } else {
            onChange(e.target.value);
          }
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ),
    Button: ({ children, onClick, disabled }) => (
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
    Row: ({ children }) => <div>{children}</div>,
    Col: ({ children }) => <div>{children}</div>,
    Tag: ({ children, onClose }) => (
      <span data-testid="course-tag" onClick={onClose}>
        {children}
      </span>
    ),
    Space: ({ children }) => <div>{children}</div>,
    Empty: ({ description }) => <div>{description}</div>,
    Typography: { Text: ({ children }) => <div>{children}</div> },
    Divider: () => <hr />,
    message,
  };
});

/* ------------------ Tests ------------------ */

describe('CourseAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads courses and warns when viewing without selection', async () => {
    const user = userEvent.setup();
    const { message } = require('antd');

    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 10 },
    ]);

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    await user.click(
      screen.getByRole('button', { name: /view analysis/i })
    );

    expect(message.info).toHaveBeenCalledWith(
      'Please select at least one course'
    );
  });

  test('shows chart when course selected and view clicked', async () => {
    const user = userEvent.setup();

    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 10 },
    ]);

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    await user.selectOptions(
      screen.getByLabelText('courses'),
      ['1']
    );

    await user.click(
      screen.getByRole('button', { name: /view analysis/i })
    );

    expect(screen.getByTestId('barchart')).toBeInTheDocument();
  });

  test('shows error when courses API fails', async () => {
    const { message } = require('antd');

    courseAPI.getCourses.mockRejectedValueOnce(
      new Error('API error')
    );

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(message.error).toHaveBeenCalledWith(
        'Failed to load courses'
      )
    );
  });

  test('shows warning when selecting more than max courses', async () => {
    const user = userEvent.setup();
    const { message } = require('antd');

    const courses = Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      title: `Course ${i + 1}`,
    }));

    courseAPI.getCourses.mockResolvedValueOnce(courses);

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    await user.selectOptions(
      screen.getByLabelText('courses'),
      courses.map((c) => String(c.id))
    );

    expect(message.warning).toHaveBeenCalledWith(
      'You can select maximum 7 courses'
    );
  });

  test('changes KPI selection', async () => {
    const user = userEvent.setup();

    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', rating: 4 },
    ]);

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    const kpiSelect = screen.getByLabelText('kpi');
    await user.selectOptions(kpiSelect, 'rating');

    expect(kpiSelect.value).toBe('rating');
  });

  test('downloads PNG successfully', async () => {
    const user = userEvent.setup();
    const htmlToImage = require('html-to-image');

    htmlToImage.toPng.mockResolvedValue(
      'data:image/png;base64,test'
    );

    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 10 },
    ]);

    const clickSpy = jest.spyOn(
      HTMLAnchorElement.prototype,
      'click'
    );

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    await user.selectOptions(
      screen.getByLabelText('courses'),
      ['1']
    );

    await user.click(
      screen.getByRole('button', { name: /view analysis/i })
    );

    await user.click(
      screen.getByRole('button', { name: /download png/i })
    );

    expect(htmlToImage.toPng).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  test('shows error when PNG export fails', async () => {
    const user = userEvent.setup();
    const { message } = require('antd');
    const htmlToImage = require('html-to-image');

    htmlToImage.toPng.mockRejectedValue(
      new Error('PNG failed')
    );

    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 10 },
    ]);

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    await user.selectOptions(
      screen.getByLabelText('courses'),
      ['1']
    );

    await user.click(
      screen.getByRole('button', { name: /view analysis/i })
    );

    await user.click(
      screen.getByRole('button', { name: /download png/i })
    );

    await waitFor(() =>
      expect(message.error).toHaveBeenCalledWith(
        'Failed to export PNG'
      )
    );
  });

  // test('shows error when chart ref is not available', async () => {
  //   const user = userEvent.setup();
  //   const { message } = require('antd');

  //   courseAPI.getCourses.mockResolvedValueOnce([]);

  //   render(<CourseAnalytics />);

  //   await waitFor(() =>
  //     expect(courseAPI.getCourses).toHaveBeenCalled()
  //   );

  //   await user.click(
  //     screen.getByRole('button', { name: /download png/i })
  //   );

  //   expect(message.error).toHaveBeenCalledWith(
  //     'Chart is not available for export'
  //   );
  // });

  test('removes course when tag close is clicked', async () => {
    const user = userEvent.setup();

    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 10 },
    ]);

    render(<CourseAnalytics />);

    await waitFor(() =>
      expect(courseAPI.getCourses).toHaveBeenCalled()
    );

    await user.selectOptions(
      screen.getByLabelText('courses'),
      ['1']
    );

    const tag = screen.getByTestId('course-tag');
    await user.click(tag);

    expect(screen.queryByTestId('course-tag')).not.toBeInTheDocument();
  });
});
