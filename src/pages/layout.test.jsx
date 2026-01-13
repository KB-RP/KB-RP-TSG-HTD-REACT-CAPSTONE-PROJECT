import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Layout from './layout';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet" />,
  };
});

jest.mock('../components/layout/navbar', () => ({
  __esModule: true,
  default: ({ onMenuClick }) => <button onClick={onMenuClick}>menu</button>,
}));

jest.mock('../components/layout/Sidebar', () => ({
  __esModule: true,
  default: ({ isOpen, isMobile, collapsed, onToggleCollapse }) => (
    <div>
      <div data-testid="sidebar" data-open={String(!!isOpen)} data-mobile={String(!!isMobile)} data-collapsed={String(!!collapsed)} />
      <button onClick={onToggleCollapse}>toggle-collapse</button>
    </div>
  ),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders outlet and toggles sidebar open via navbar', async () => {
    const user = userEvent.setup();

    render(<Layout />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');

    await user.click(screen.getByText('menu'));

    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'true');
  });
});
