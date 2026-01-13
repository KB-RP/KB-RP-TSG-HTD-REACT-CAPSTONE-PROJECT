import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Sidebar from './sidebar';
import { useAuth } from '../../contexts';

jest.mock('../../contexts', () => ({
  useAuth: jest.fn(),
}));

jest.mock('antd', () => ({
  Popconfirm: ({ children, onConfirm }) => (
    <div data-testid="popconfirm" onClick={onConfirm}>
      {children}
    </div>
  ),
}));

describe('Sidebar', () => {
  const baseProps = {
    isOpen: true,
    onClose: jest.fn(),
    isMobile: true,
    collapsed: false,
    onToggleCollapse: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ logout: jest.fn(), user: { role: 'student' } });
  });

  test('renders base nav items', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar {...baseProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Courses')).toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  test('renders Settings item for admin user', () => {
    useAuth.mockReturnValue({ logout: jest.fn(), user: { role: 'admin' } });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar {...baseProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('highlights active route link', () => {
    useAuth.mockReturnValue({ logout: jest.fn(), user: { role: 'admin' } });

    render(
      <MemoryRouter initialEntries={['/dashboard/admin-settings']}>
        <Sidebar {...baseProps} />
      </MemoryRouter>
    );

    const settingsLink = screen.getByText('Settings').closest('a');
    expect(settingsLink).toHaveClass('nav-menu__link--active');
  });

  test('calls onClose when overlay is clicked on mobile', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar {...baseProps} />
      </MemoryRouter>
    );

    const overlay = document.querySelector('.sidebar-overlay');
    expect(overlay).toBeTruthy();

    await user.click(overlay);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when clicking a nav link on mobile', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar {...baseProps} />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Dashboard'));
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('calls logout when confirming logout', async () => {
    const user = userEvent.setup();
    const logout = jest.fn();
    useAuth.mockReturnValue({ logout, user: { role: 'student' } });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar {...baseProps} />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Logout'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
