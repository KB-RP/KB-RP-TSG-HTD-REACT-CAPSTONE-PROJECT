import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Navbar from './navbar';

describe('Navbar', () => {
  test('renders logo and notification badge', () => {
    render(<Navbar onMenuClick={jest.fn()} />);

    expect(screen.getByText('LMS')).toBeInTheDocument();
    expect(screen.getByLabelText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('calls onMenuClick when menu button is clicked', async () => {
    const user = userEvent.setup();
    const onMenuClick = jest.fn();

    render(<Navbar onMenuClick={onMenuClick} />);

    await user.click(screen.getByLabelText(/toggle menu/i));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});
