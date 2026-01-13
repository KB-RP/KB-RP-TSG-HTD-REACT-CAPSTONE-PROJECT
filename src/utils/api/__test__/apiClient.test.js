import axios from 'axios';

/* ---------- INTERCEPTOR HOLDERS (MUST USE var) ---------- */
var requestInterceptor;
var responseSuccessInterceptor;
var responseErrorInterceptor;

/* ---------- MOCK AXIOS BEFORE IMPORT ---------- */
jest.mock('axios', () => {
    const mockAxiosInstance = {
        interceptors: {
            request: {
                use: jest.fn((fn) => {
                    requestInterceptor = fn;
                }),
            },
            response: {
                use: jest.fn((success, error) => {
                    responseSuccessInterceptor = success;
                    responseErrorInterceptor = error;
                }),
            },
        },
    };

    return {
        create: jest.fn(() => mockAxiosInstance),
    };
});

/* ---------- IMPORT AFTER MOCK ---------- */
import apiClient from '../apiClient';

describe('apiClient', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    /* ---------- REQUEST INTERCEPTOR ---------- */
    test('adds Authorization header when token exists', () => {
        localStorage.setItem('token', 'test-token');

        const config = { headers: {} };
        const updatedConfig = requestInterceptor(config);

        expect(updatedConfig.headers.Authorization).toBe(
            'Bearer test-token'
        );
    });

    test('does not add Authorization header when token does not exist', () => {
        const config = { headers: {} };
        const updatedConfig = requestInterceptor(config);

        expect(updatedConfig.headers.Authorization).toBeUndefined();
    });

    /* ---------- RESPONSE SUCCESS ---------- */
    test('returns response as-is on success', () => {
        const response = { data: { success: true } };

        const result = responseSuccessInterceptor(response);

        expect(result).toBe(response);
    });

    /* ---------- RESPONSE ERROR 401 ---------- */
    test('handles 401 error: removes token and redirects', async () => {
        localStorage.setItem('token', 'test-token');

        const error = {
            response: { status: 401 },
        };

        await expect(responseErrorInterceptor(error)).rejects.toEqual(error);

        expect(localStorage.getItem('token')).toBeNull();
    });


    /* ---------- RESPONSE ERROR NON-401 ---------- */
    test('passes through non-401 errors', async () => {
        const error = {
            response: { status: 500 },
        };

        await expect(
            responseErrorInterceptor(error)
        ).rejects.toEqual(error);
    });
});
