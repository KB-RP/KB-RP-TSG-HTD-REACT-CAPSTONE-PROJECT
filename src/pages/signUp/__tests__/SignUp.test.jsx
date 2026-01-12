import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from '../index.jsx';

// mock useSignUp hook
jest.mock('../useSignUp', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSignUp from '../useSignUp';

describe('SignUp Page', () => {
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  const baseMockReturn = {
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    errors: {},
    isLoading: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form with all inputs and button', () => {
    useSignUp.mockReturnValue(baseMockReturn);

    render(<SignUp />);

    expect(screen.getByText('Join Our Learning Community')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test('calls handleSubmit on form submit', () => {
    useSignUp.mockReturnValue(baseMockReturn);

    render(<SignUp />);

    fireEvent.submit(
      screen.getByRole('button', { name: /sign up/i })
        .closest('form')
    );

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('shows loading state when isLoading is true', () => {
    useSignUp.mockReturnValue({
      ...baseMockReturn,
      isLoading: true,
    });

    render(<SignUp />);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Creating Account...');
  });

  test('renders signin link', () => {
    useSignUp.mockReturnValue(baseMockReturn);

    render(<SignUp />);

    const link = screen.getByRole('link', { name: /sign in/i });

    expect(link).toHaveAttribute('href', '/signin');
  });
});
