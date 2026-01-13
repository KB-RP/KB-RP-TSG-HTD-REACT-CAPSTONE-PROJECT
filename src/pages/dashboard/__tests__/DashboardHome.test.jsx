import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHome from '../index.jsx'; 
import { useDashboardCourses } from '../useDashboardCourses';

jest.mock('../useDashboardCourses', () => ({
  useDashboardCourses: jest.fn(),
}));

jest.mock('antd', () => ({
  AutoComplete: ({ children, onChange, onSelect }) => (
    <div 
      data-testid="mock-autocomplete" 
      onChange={(e) => onChange?.(e.target.value)}
      // Manually trigger onSelect if needed in tests
      onClick={() => onSelect?.('Selected Value')} 
    >
      {children}
    </div>
  ),
  Input: ({ placeholder, value, allowClear }) => (
    <input 
      placeholder={placeholder} 
      value={value}
      onChange={() => {}} 
      data-testid="mock-input"
    />
  ),
  Select: ({ onChange, options, value }) => (
    <select 
      data-testid="filter-select"
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
  Flex: ({ children }) => <div>{children}</div>,
  Empty: ({ description }) => <div>{description}</div>,
}));

jest.mock('@ant-design/icons', () => ({
  SearchOutlined: () => <span />,
}));

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

  test('executes all interactive lines and branches', () => {
    useDashboardCourses.mockReturnValue({
      ...mockHookReturn,
      filteredCourses: [{ id: 1, title: 'React Course' }]
    });

    render(<DashboardHome />);

    // --- 1. Coverage for Search & AutoComplete ---
    const input = screen.getByPlaceholderText('Search courses');
    fireEvent.change(input, { target: { value: 'React' } });
    expect(mockSetSearch).toHaveBeenCalledWith('React');
    
    // Trigger onSelect branch
    const autoComplete = screen.getByTestId('mock-autocomplete');
    fireEvent.click(autoComplete);
    expect(mockSetSearch).toHaveBeenCalledWith('Selected Value');

    // --- 2. Coverage for all 4 Select Filters (Lines 71-113) ---
    const selects = screen.getAllByTestId('filter-select');
    
    selects.forEach((select) => {
      fireEvent.change(select, { target: { value: 'test-value' } });
    });

    // Manually execute the functional state updates to cover the internal arrow functions
    // Call 0: Students, Call 1: Duration, Call 2: Price, Call 3: Rating
    const prevState = { students: 'any', duration: 'any', price: 'any', rating: 'any' };
    
    expect(mockSetFilters.mock.calls[0][0](prevState).students).toBe('');
    expect(mockSetFilters.mock.calls[1][0](prevState).duration).toBe('');
    expect(mockSetFilters.mock.calls[2][0](prevState).price).toBe('');
    expect(mockSetFilters.mock.calls[3][0](prevState).rating).toBe('');

    // --- 3. Coverage for Reset Button ---
    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);
    expect(mockResetFilters).toHaveBeenCalled();

    // --- 4. Coverage for Course Grid Branches ---
    expect(screen.getByTestId('course-card')).toBeInTheDocument();
  });

  test('executes Empty state branch', () => {
    useDashboardCourses.mockReturnValue({
      ...mockHookReturn,
      filteredCourses: [] // Array is empty, triggers <Empty />
    });

    render(<DashboardHome />);
    expect(screen.getByText('No courses found')).toBeInTheDocument();
  });
});