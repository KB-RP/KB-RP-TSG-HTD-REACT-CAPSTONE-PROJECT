import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AdminSettings from '../index.jsx';

jest.mock('@ant-design/icons', () => ({
  PlusOutlined: () => null,
  EditOutlined: () => null,
  BarChartOutlined: () => null,
}));

jest.mock('../childs/addCourse', () => () => <div>AddCoursePane</div>);
jest.mock('../childs/manageCourses', () => () => <div>ManageCoursesPane</div>);
jest.mock('../childs/courseAnalytics', () => () => <div>CourseAnalyticsPane</div>);

const mockNavigate = jest.fn();
let mockLocation = { search: '?tab=2' };

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

jest.mock('antd', () => {
  const TabsImpl = ({ activeKey, onChange, children }) => (
    <div data-testid="tabs" data-active={activeKey}>
      <button onClick={() => onChange('1')}>tab1</button>
      <button onClick={() => onChange('2')}>tab2</button>
      <button onClick={() => onChange('3')}>tab3</button>
      {children}
    </div>
  );

  TabsImpl.TabPane = ({ children }) => <div>{children}</div>;

  return {
    Tabs: TabsImpl,
  };
});

describe('AdminSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = { search: '?tab=2' };
  });

  test('reads tab from URL and sets activeKey', () => {
    render(<AdminSettings />);

    const tabs = screen.getByTestId('tabs');
    expect(tabs).toHaveAttribute('data-active', '2');
    expect(screen.getByText('Admin Settings')).toBeInTheDocument();
  });

  test('updates URL when switching tabs', async () => {
    const user = userEvent.setup();

    render(<AdminSettings />);

    await user.click(screen.getByText('tab3'));

    expect(mockNavigate).toHaveBeenCalledWith('?tab=3', { replace: true });
  });
});
