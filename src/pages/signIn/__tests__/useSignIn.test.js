import { renderHook, act } from '@testing-library/react';
import useSignIn from '../useSignIn';
import { useAuth } from '../../../contexts';

/* ------------------ MOCKS ------------------ */
jest.mock('../../../contexts', () => ({
  useAuth: jest.fn(),
}));

describe('useSignIn hook', () => {
  let loginMock;

  // Suppress expected console.error logs from failed login
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    loginMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ---------- INITIAL STATE ---------- */
  test('should initialize with default state', () => {
    const { result } = renderHook(() => useSignIn());

    expect(result.current.formData).toEqual({
      email: '',
      password: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.submitError).toBe('');
  });

  /* ---------- HANDLE CHANGE ---------- */
  test('should update formData on handleChange', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
    });

    expect(result.current.formData.email).toBe('test@example.com');
  });

  test('should clear field error on change', async () => {
    const { result } = renderHook(() => useSignIn());

    // Trigger validation error
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(result.current.errors.email).toBeDefined();

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
    });

    expect(result.current.errors.email).toBe('');
  });

  test('should clear submitError on typing', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'a' },
      });
    });

    expect(result.current.submitError).toBe('');
  });

  /* ---------- VALIDATION ---------- */
  test('should set validation errors for empty form', async () => {
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
    expect(loginMock).not.toHaveBeenCalled();
  });

  test('should validate invalid email and short password', async () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'invalid' },
      });
      result.current.handleChange({
        target: { name: 'password', value: '123' },
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(result.current.errors.email).toBe('Email is invalid');
    expect(result.current.errors.password).toBe(
      'Password must be at least 6 characters'
    );
    expect(loginMock).not.toHaveBeenCalled();
  });

  /* ---------- SUCCESS SUBMIT ---------- */
  test('should call login with valid data', async () => {
    loginMock.mockResolvedValueOnce({});

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(loginMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.submitError).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  /* ---------- FAILED SUBMIT ---------- */
  test('should handle login failure', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(result.current.submitError).toBe('Invalid credentials');
    expect(result.current.isLoading).toBe(false);
  });


  test('handleChange when no previous error', () => {
  const { result } = renderHook(() => useSignIn());

  act(() => {
    result.current.handleChange({
      target: { name: 'email', value: 'new@example.com' },
    });
  });

  // This will cover the `: prev` branch in setErrors
  expect(result.current.errors.email).toBe('');
});

/* ---------- LOGIN FAILURE WITHOUT MESSAGE ---------- */
test('should handle login failure with no error message', async () => {
  loginMock.mockRejectedValueOnce({}); // no message

  const { result } = renderHook(() => useSignIn());

  act(() => {
    result.current.handleChange({
      target: { name: 'email', value: 'test@example.com' },
    });
    result.current.handleChange({
      target: { name: 'password', value: 'password123' },
    });
  });

  await act(async () => {
    await result.current.handleSubmit({ preventDefault: jest.fn() });
  });

  // This will hit the "Login failed. Please try again." branch
  expect(result.current.submitError).toBe('Login failed. Please try again.');
});
});
