// src/pages/dashboard/Home.jsx
import React, { useEffect, useMemo, useState } from 'react';
import CourseCard from '../../components/course/courseCard';
import { courseAPI } from '../../utils/api/courseApi';
import { AutoComplete, Input, Select, Row, Col, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Empty } from 'antd';


const DashboardHome = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    students: 'any',      // any, lt500, 500_2000, 2000_10000, gt10000
    duration: 'any',      // any, lt5, 5_10, 10_20, gt20
    price: 'any',         // any, free, lt50, 50_100, 100_200, gt200
    rating: 'any',        // any, gte35, gte40, gte45
  });

  const fetchAllCourses = async () => {
    const res = await courseAPI.getCourses();
    setAllCourses(res || []);
    setFilteredCourses(res || []);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Suggestions: title-only
  const suggestions = useMemo(() => {
    const q = debouncedSearch;
    if (!q) return [];
    return allCourses
      .filter((c) => c.title?.toLowerCase().includes(q))
      .slice(0, 8)
      .map((c) => ({ value: c.title }));
  }, [debouncedSearch, allCourses]);

  // Helpers to match bucketed filters
  const matchStudents = (val, key) => {
    const v = Number(val || 0);
    switch (key) {
      case 'lt500': return v < 500;
      case '500_2000': return v >= 500 && v <= 2000;
      case '2000_10000': return v > 2000 && v <= 10000;
      case 'gt10000': return v > 10000;
      default: return true;
    }
  };

  const matchDuration = (val, key) => {
    const v = Number(val || 0);
    switch (key) {
      case 'lt5': return v < 5;
      case '5_10': return v >= 5 && v <= 10;
      case '10_20': return v > 10 && v <= 20;
      case 'gt20': return v > 20;
      default: return true;
    }
  };

  const matchPrice = (val, key) => {
    const v = Number(val || 0);
    switch (key) {
      case 'free': return v === 0;
      case 'lt50': return v > 0 && v < 50;
      case '50_100': return v >= 50 && v <= 100;
      case '100_200': return v > 100 && v <= 200;
      case 'gt200': return v > 200;
      default: return true;
    }
  };

  const matchRating = (val, key) => {
    const v = Number(val || 0);
    switch (key) {
      case 'gte45': return v >= 4.5;
      case 'gte40': return v >= 4.0;
      case 'gte35': return v >= 3.5;
      default: return true;
    }
  };

  // Apply filters + search
  useEffect(() => {
    const q = debouncedSearch;
    const next = allCourses.filter((c) => {
      const matchesQuery = !q || c.title?.toLowerCase().includes(q);
      if (!matchesQuery) return false;

      return (
        matchStudents(c.students, filters.students) &&
        matchDuration(c.duration, filters.duration) &&
        matchPrice(c.price, filters.price) &&
        matchRating(c.rating, filters.rating)
      );
    });
    setFilteredCourses(next);
  }, [debouncedSearch, filters, allCourses]);

  const resetFilters = () => {
    setFilters({ students: 'any', duration: 'any', price: 'any', rating: 'any' });
  };

  // no-op: bucket filters start as 'any'

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <div className="dashboard-header__content">

          <h1 className="dashboard-title">Explore Courses</h1>
          <Row
            gutter={[16, 16]}
            justify="center"
            style={{ marginTop: 12 }}
          >
            <Col xs={24} sm={22} md={18} lg={16} xl={14}>
              <AutoComplete
                options={suggestions}
                value={search}
                onChange={setSearch}
                onSelect={setSearch}
                className="dashboard-search"
              >
                <Input
                  placeholder="Search courses"
                  size="large"

                  allowClear
                  prefix={<SearchOutlined className="search-icon" />}
                />
              </AutoComplete>
            </Col>

            <Col xs={24} md={20} lg={18}>
              <div className="filters-box">
                <Row gutter={[12, 12]}>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Select
                      value={filters.students}
                      onChange={(v) => setFilters((f) => ({ ...f, students: v }))}
                      style={{ width: '100%' }}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Students: Any' },
                        { value: 'lt500', label: '< 500' },
                        { value: '500_2000', label: '500–2k' },
                        { value: '2000_10000', label: '2k–10k' },
                        { value: 'gt10000', label: '> 10k' },
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Select
                      value={filters.duration}
                      onChange={(v) => setFilters((f) => ({ ...f, duration: v }))}
                      style={{ width: '100%' }}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Duration: Any' },
                        { value: 'lt5', label: '< 5h' },
                        { value: '5_10', label: '5–10h' },
                        { value: '10_20', label: '10–20h' },
                        { value: 'gt20', label: '> 20h' },
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Select
                      value={filters.price}
                      onChange={(v) => setFilters((f) => ({ ...f, price: v }))}
                      style={{ width: '100%' }}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Price: Any' },
                        { value: 'free', label: 'Free' },
                        { value: 'lt50', label: '< $50' },
                        { value: '50_100', label: '$50–$100' },
                        { value: '100_200', label: '$100–$200' },
                        { value: 'gt200', label: '> $200' },
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Select
                      value={filters.rating}
                      onChange={(v) => setFilters((f) => ({ ...f, rating: v }))}
                      style={{ width: '100%' }}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Rating: Any' },
                        { value: 'gte35', label: '≥ 3.5' },
                        { value: 'gte40', label: '≥ 4.0' },
                        { value: 'gte45', label: '≥ 4.5' },
                      ]}
                    />
                  </Col>
                  <Col xs={24}>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                      <button onClick={resetFilters} className='course-card__button'>Clear</button>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

        </div>
      </div>

      <div className="courses-section">
        <div className="courses-grid">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))
          ) : (
            <Empty
              description="No courses found"
              justify="center" align="center"
              style={{ marginTop: 60 }}
            />

          )}
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
