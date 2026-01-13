import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '../index';
import useSignIn from '../useSignIn';

// -------------------- MOCK useSignIn --------------------
jest.mock('../useSignIn');

// -------------------- MOCK FormInput --------------------
jest.mock('../../../components/formInput', () => ({
  FormInput: ({ id, label, value, onChange, error }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={id}
        value={value}
        onChange={onChange}
      />
      {error && <span>{error}</span>}
    </div>
  )
}));

describe('SignIn', () => {
  const baseHookReturn = {
    formData: { email: '', password: '' },
    errors: {},
    isLoading: false,
    handleChange: jest.fn(),
    handleSubmit: jest.fn((e) => e.preventDefault())
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSignIn.mockReturnValue(baseHookReturn);
  });

  test('renders SignIn page correctly', () => {
    render(<SignIn />);

    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /^sign in$/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test('calls handleChange on input change', () => {
    render(<SignIn />);

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'test@example.com' }
    });

    expect(baseHookReturn.handleChange).toHaveBeenCalled();
  });

  test('submits form correctly', () => {
    render(<SignIn />);

    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    fireEvent.submit(form);

    expect(baseHookReturn.handleSubmit).toHaveBeenCalled();
  });

  test('disables submit button when loading', () => {
    useSignIn.mockReturnValue({
      ...baseHookReturn,
      isLoading: true
    });

    render(<SignIn />);

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeDisabled();
  });

  test('shows validation errors', () => {
    useSignIn.mockReturnValue({
      ...baseHookReturn,
      errors: {
        email: 'Email is required',
        password: 'Password is required'
      }
    });

    render(<SignIn />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('renders signup link', () => {
    render(<SignIn />);

    const link = screen.getByRole('link', { name: /sign up/i });
    expect(link).toHaveAttribute('href', '/signup');
  });
});
