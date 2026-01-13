import { renderHook, act, waitFor } from '@testing-library/react';
import { useDashboardCourses } from '../useDashboardCourses';
import { courseAPI } from '../../../utils/api/courseApi';

jest.mock('../../../utils/api/courseApi', () => ({
  courseAPI: {
    getCourses: jest.fn(),
  },
}));

describe('useDashboardCourses', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  /* ---------- Initial fetch ---------- */
test('fetches courses on mount and initializes filteredCourses', async () => {
  courseAPI.getCourses.mockResolvedValueOnce([
    { id: 1, title: 'React', students: 1000, duration: 5, price: 0, rating: 4.5 },
    { id: 2, title: 'Node', students: 100, duration: 2, price: 10, rating: 3.4 },
  ]);

  const { result } = renderHook(() => useDashboardCourses());

  // Wait for API call
  await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalledTimes(1));

  // Flush debounce timer
  act(() => {
    jest.advanceTimersByTime(300);
  });

  // NOW filteredCourses will be populated
  await waitFor(() =>
    expect(result.current.filteredCourses).toHaveLength(2)
  );

  expect(result.current.search).toBe('');
  expect(result.current.filters).toEqual({
    students: 'any',
    duration: 'any',
    price: 'any',
    rating: 'any',
  });
});


  /* ---------- Debounced search + suggestions ---------- */
  test('debounces search and produces suggestions', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React Fundamentals' },
      { id: 2, title: 'Advanced React' },
      { id: 3, title: 'Node Basics' },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setSearch('react');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.suggestions).toEqual([
      { value: 'React Fundamentals' },
      { value: 'Advanced React' },
    ]);
  });

  test('returns empty suggestions when search is empty', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React' },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setSearch('');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.suggestions).toEqual([]);
  });

  /* ---------- Students filter ---------- */
  test('filters courses with students lt500', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 100 },
      { id: 2, title: 'Node', students: 600 },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters(f => ({ ...f, students: 'lt500' }));
    });

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].title).toBe('React');
  });

  test('filters courses with students gt10000', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'Small', students: 200 },
      { id: 2, title: 'Huge', students: 15000 },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters(f => ({ ...f, students: 'gt10000' }));
    });

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].title).toBe('Huge');
  });

  /* ---------- Duration filter ---------- */
  test('filters courses with duration gt20', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'Short', duration: 5 },
      { id: 2, title: 'Long', duration: 25 },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters(f => ({ ...f, duration: 'gt20' }));
    });

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].title).toBe('Long');
  });

  /* ---------- Price filter ---------- */
  test('filters courses with price gt200', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'Cheap', price: 50 },
      { id: 2, title: 'Expensive', price: 300 },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters(f => ({ ...f, price: 'gt200' }));
    });

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].title).toBe('Expensive');
  });

  /* ---------- Rating filter ---------- */
  test('filters courses with rating gte45', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'Good', rating: 4.2 },
      { id: 2, title: 'Excellent', rating: 4.8 },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters(f => ({ ...f, rating: 'gte45' }));
    });

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].title).toBe('Excellent');
  });

  /* ---------- Combined filters ---------- */
  test('applies multiple filters together', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      {
        id: 1,
        title: 'React',
        students: 200,
        duration: 4,
        price: 0,
        rating: 4.8,
      },
      {
        id: 2,
        title: 'Node',
        students: 12000,
        duration: 30,
        price: 300,
        rating: 3.5,
      },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters({
        students: 'lt500',
        duration: 'lt5',
        price: 'free',
        rating: 'gte45',
      });
    });

    expect(result.current.filteredCourses).toHaveLength(1);
    expect(result.current.filteredCourses[0].title).toBe('React');
  });

  /* ---------- Reset filters ---------- */
  test('resetFilters resets filters to defaults', async () => {
    courseAPI.getCourses.mockResolvedValueOnce([
      { id: 1, title: 'React', students: 100 },
    ]);

    const { result } = renderHook(() => useDashboardCourses());
    await waitFor(() => expect(courseAPI.getCourses).toHaveBeenCalled());

    act(() => {
      result.current.setFilters(f => ({ ...f, students: 'lt500' }));
    });

    expect(result.current.filters.students).toBe('lt500');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      students: 'any',
      duration: 'any',
      price: 'any',
      rating: 'any',
    });
  });
});
