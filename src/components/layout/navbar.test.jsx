import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Navbar from './navbar';

describe('Navbar', () => {
  test('renders logo and avatar initial', () => {
    render(<Navbar onMenuClick={jest.fn()} userName="alice" />);

    expect(screen.getByText('LMS')).toBeInTheDocument();
    expect(screen.queryByLabelText(/notifications/i)).toBeNull();
    expect(screen.getByLabelText(/user-avatar/i)).toHaveTextContent('A');
  });

  test('calls onMenuClick when menu button is clicked', async () => {
    const user = userEvent.setup();
    const onMenuClick = jest.fn();

    render(<Navbar onMenuClick={onMenuClick} />);

    await user.click(screen.getByLabelText(/toggle menu/i));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});
