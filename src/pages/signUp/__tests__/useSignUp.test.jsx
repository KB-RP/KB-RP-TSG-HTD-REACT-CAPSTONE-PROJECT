import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useSignUp from '../useSignUp';
import { authAPI } from '../../../utils/api/authAPI';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../utils/api/authAPI', () => ({
  authAPI: {
    register: jest.fn(),
  },
}));

describe('useSignUp hook', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useSignUp());

    expect(result.current.formData).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  test('should update formData on handleChange', () => {
    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.handleChange({ target: { name: 'firstName', value: 'John' } });
    });

    expect(result.current.formData.firstName).toBe('John');
  });

  test('should clear field error on handleChange', () => {
    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'wrong' } });
      result.current.errors.email = 'Email is required';
    });

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'john@example.com' } });
    });

    expect(result.current.errors.email).toBe('');
  });

  test('should validate required fields', async () => {
    const { result } = renderHook(() => useSignUp());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(result.current.errors.firstName).toBe('First name is required');
    expect(result.current.errors.lastName).toBe('Last name is required');
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
    expect(result.current.errors.confirmPassword).toBe('');
  });

  test('should validate email format and password length', async () => {
    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'invalid' } });
      result.current.handleChange({ target: { name: 'password', value: '123' } });
      result.current.handleChange({ target: { name: 'confirmPassword', value: '123' } });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(result.current.errors.email).toBe('Email is invalid');
    expect(result.current.errors.password).toBe('Password must be at least 6 characters');
    expect(result.current.errors.confirmPassword).toBe('');
  });

  test('should validate password mismatch', async () => {
    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.handleChange({ target: { name: 'password', value: 'password123' } });
      result.current.handleChange({ target: { name: 'confirmPassword', value: 'password321' } });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(result.current.errors.confirmPassword).toBe('Passwords do not match');
  });

  test('should call API and navigate on successful submission', async () => {
    const { result } = renderHook(() => useSignUp());

    authAPI.register.mockResolvedValueOnce({ success: true });

    // Fill valid form
    act(() => {
      result.current.handleChange({ target: { name: 'firstName', value: 'John' } });
      result.current.handleChange({ target: { name: 'lastName', value: 'Doe' } });
      result.current.handleChange({ target: { name: 'email', value: 'john@example.com' } });
      result.current.handleChange({ target: { name: 'password', value: 'password123' } });
      result.current.handleChange({ target: { name: 'confirmPassword', value: 'password123' } });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(authAPI.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(navigateMock).toHaveBeenCalledWith('/signin');
    expect(result.current.isLoading).toBe(false);
  });
});
