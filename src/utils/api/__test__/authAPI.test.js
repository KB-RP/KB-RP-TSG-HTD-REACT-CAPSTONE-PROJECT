import { AUTH } from '../apiEndpoints';
import apiClient from '../apiClient';
import { authAPI } from '../authAPI';

jest.mock('../apiClient');

describe('authAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    test('should login successfully and store token', async () => {
      const credentials = { email: 'test@test.com', password: '123456' };
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, email: 'test@test.com' },
      };

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authAPI.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith(
        AUTH.LOGIN,
        credentials
      );
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(result).toEqual(mockResponse);
    });

    test('should login successfully without token', async () => {
      const credentials = { email: 'test@test.com', password: '123456' };
      const mockResponse = { user: { id: 1 } };

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authAPI.login(credentials);

      expect(localStorage.getItem('token')).toBeNull();
      expect(result).toEqual(mockResponse);
    });

    test('should throw API error response', async () => {
      apiClient.post.mockRejectedValue({
        response: { data: 'Invalid credentials' },
      });

      await expect(
        authAPI.login({})
      ).rejects.toBe('Invalid credentials');
    });

    test('should throw generic error message', async () => {
      apiClient.post.mockRejectedValue({
        message: 'Network Error',
      });

      await expect(
        authAPI.login({})
      ).rejects.toBe('Network Error');
    });
  });

  describe('register', () => {
    test('should register user successfully', async () => {
      const userData = { email: 'new@test.com' };
      const mockResponse = { success: true };

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authAPI.register(userData);

      expect(apiClient.post).toHaveBeenCalledWith(
        AUTH.REGISTER,
        userData
      );
      expect(result).toEqual(mockResponse);
    });

    test('should throw API error on register', async () => {
      apiClient.post.mockRejectedValue({
        response: { data: 'Email already exists' },
      });

      await expect(
        authAPI.register({})
      ).rejects.toBe('Email already exists');
    });
  });

describe('logout', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('should logout successfully and remove token', async () => {
    localStorage.setItem('token', 'fake-token');

    apiClient.post.mockResolvedValue({});

    await authAPI.logout();

    expect(apiClient.post).toHaveBeenCalledWith(AUTH.LOGOUT);
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('should remove token even if API fails', async () => {
    localStorage.setItem('token', 'fake-token');

    apiClient.post.mockRejectedValue(new Error('Logout failed'));

    await expect(authAPI.logout()).rejects.toThrow('Logout failed');

    // finally block MUST execute
    expect(localStorage.getItem('token')).toBeNull();
  });
});

  describe('getProfile', () => {
    test('should return user profile', async () => {
      const mockProfile = { id: 1, email: 'test@test.com' };

      apiClient.get.mockResolvedValue({ data: mockProfile });

      const result = await authAPI.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith(AUTH.PROFILE);
      expect(result).toEqual(mockProfile);
    });

    test('should throw API error response', async () => {
      apiClient.get.mockRejectedValue({
        response: { data: 'Unauthorized' },
      });

      await expect(
        authAPI.getProfile()
      ).rejects.toBe('Unauthorized');
    });

    test('should throw generic error message', async () => {
      apiClient.get.mockRejectedValue({
        message: 'Network Error',
      });

      await expect(
        authAPI.getProfile()
      ).rejects.toBe('Network Error');
    });
  });
});
