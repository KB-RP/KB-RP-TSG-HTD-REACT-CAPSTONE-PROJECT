import { useEffect, useMemo, useState } from 'react';
import { courseAPI } from '../../utils/api/courseApi';

const DEFAULT_FILTERS = {
  students: 'any',
  duration: 'any',
  price: 'any',
  rating: 'any',
};

export const useDashboardCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /* ---------- Fetch courses ---------- */
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await courseAPI.getCourses();
      setAllCourses(res || []);
      setFilteredCourses(res || []);
    };
    fetchCourses();
  }, []);

  /* ---------- Debounce search ---------- */
  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedSearch(search.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(id);
  }, [search]);

  /* ---------- Suggestions ---------- */
  const suggestions = useMemo(() => {
    if (!debouncedSearch) return [];
    return allCourses
      .filter(c =>
        c.title?.toLowerCase().includes(debouncedSearch)
      )
      .slice(0, 8)
      .map(c => ({ value: c.title }));
  }, [debouncedSearch, allCourses]);

  /* ---------- Filter matchers ---------- */
  const matchStudents = (v, key) => {
    v = Number(v || 0);
    switch (key) {
      case 'lt500': return v < 500;
      case '500_2000': return v >= 500 && v <= 2000;
      case '2000_10000': return v > 2000 && v <= 10000;
      case 'gt10000': return v > 10000;
      default: return true;
    }
  };

  const matchDuration = (v, key) => {
    v = Number(v || 0);
    switch (key) {
      case 'lt5': return v < 5;
      case '5_10': return v >= 5 && v <= 10;
      case '10_20': return v > 10 && v <= 20;
      case 'gt20': return v > 20;
      default: return true;
    }
  };

  const matchPrice = (v, key) => {
    v = Number(v || 0);
    switch (key) {
      case 'free': return v === 0;
      case 'lt50': return v > 0 && v < 50;
      case '50_100': return v >= 50 && v <= 100;
      case '100_200': return v > 100 && v <= 200;
      case 'gt200': return v > 200;
      default: return true;
    }
  };

  const matchRating = (v, key) => {
    v = Number(v || 0);
    switch (key) {
      case 'gte45': return v >= 4.5;
      case 'gte40': return v >= 4.0;
      case 'gte35': return v >= 3.5;
      default: return true;
    }
  };

  /* ---------- Apply filters ---------- */
  useEffect(() => {
    const q = debouncedSearch;

    const next = allCourses.filter(c => {
      if (q && !c.title?.toLowerCase().includes(q)) return false;

      return (
        matchStudents(c.students, filters.students) &&
        matchDuration(c.duration, filters.duration) &&
        matchPrice(c.price, filters.price) &&
        matchRating(c.rating, filters.rating)
      );
    });

    setFilteredCourses(next);
  }, [debouncedSearch, filters, allCourses]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    search,
    setSearch,
    suggestions,
    filters,
    setFilters,
    resetFilters,
    filteredCourses,
  };
};
