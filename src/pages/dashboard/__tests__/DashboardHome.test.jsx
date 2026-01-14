// src/pages/dashboard/__tests__/DashboardHome.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHome from '../index.jsx';
import { useDashboardCourses } from '../useDashboardCourses';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../useDashboardCourses', () => ({
  useDashboardCourses: jest.fn(),
}));

// Mock Ant Design components
jest.mock('antd', () => ({
  AutoComplete: ({ children, onChange, onSelect }) => (
    <div
      data-testid="mock-autocomplete"
      onChange={(e) => onChange?.(e.target.value)}
      onClick={() => onSelect?.('Selected Value')}
    >
      {children}
    </div>
  ),
  Input: ({ placeholder, value }) => (
    <input placeholder={placeholder} value={value} data-testid="mock-input" />
  ),
  Select: ({ value, onChange, options }) => (
    <select
      data-testid="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
  Flex: ({ children }) => <div>{children}</div>,
  Empty: ({ description }) => <div>{description}</div>,
}));

// Mock icons
jest.mock('@ant-design/icons', () => ({
  SearchOutlined: () => <span data-testid="search-icon" />,
}));

// Mock CourseCard
jest.mock('../../../components/course/courseCard', () => (props) => (
  <div data-testid="course-card">{props.title}</div>
));

describe('DashboardHome 100% Coverage', () => {
  const mockSetSearch = jest.fn();
  const mockSetFilters = jest.fn();
  const mockResetFilters = jest.fn();

  const mockHookReturn = {
    search: '',
    setSearch: mockSetSearch,
    suggestions: [],
    filters: { students: 'any', duration: 'any', price: 'any', rating: 'any' },
    setFilters: mockSetFilters,
    resetFilters: mockResetFilters,
    filteredCourses: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (hookReturn = mockHookReturn) =>
    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

  test('executes all interactive paths and renders courses', () => {
    useDashboardCourses.mockReturnValue({
      ...mockHookReturn,
      filteredCourses: [{ id: 1, title: 'React Course' }],
    });

    renderWithRouter();

    // ---- Search Input
    const searchInput = screen.getByPlaceholderText('Search courses');
    fireEvent.change(searchInput, { target: { value: 'React' } });
    expect(mockSetSearch).toHaveBeenCalledWith('React');

    // ---- AutoComplete select
    fireEvent.click(screen.getByTestId('mock-autocomplete'));
    expect(mockSetSearch).toHaveBeenCalledWith('Selected Value');

    // ---- Filter selects
    const selects = screen.getAllByTestId('filter-select');
    selects.forEach((select) =>
      fireEvent.change(select, { target: { value: 'test-value' } })
    );

    const prevState = { students: 'any', duration: 'any', price: 'any', rating: 'any' };
    expect(mockSetFilters.mock.calls[0][0](prevState).students).toBe('');
    expect(mockSetFilters.mock.calls[1][0](prevState).duration).toBe('');
    expect(mockSetFilters.mock.calls[2][0](prevState).price).toBe('');
    expect(mockSetFilters.mock.calls[3][0](prevState).rating).toBe('');

    // ---- Reset Filters button
    const clearBtn = screen.getByText('Clear Filters');
    fireEvent.click(clearBtn);
    expect(mockResetFilters).toHaveBeenCalled();

    // ---- CourseCard renders
    expect(screen.getByTestId('course-card')).toBeInTheDocument();
    expect(screen.getByText('React Course')).toBeInTheDocument();
  });

  test('renders Empty state when no courses', () => {
    useDashboardCourses.mockReturnValue(mockHookReturn);

    renderWithRouter();

    expect(screen.getByText('No courses found')).toBeInTheDocument();
  });
});
