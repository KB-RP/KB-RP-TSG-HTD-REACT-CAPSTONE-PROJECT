// src/pages/dashboard/Home.jsx
import '../../styles/common/Common.scss';
import CourseCard from '../../components/course/courseCard';
import { AutoComplete, Input, Select, Row, Col, Space, Button, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { useDashboardCourses } from './useDashboardCourses';

const DashboardHome = () => {
  const {
    search,
    setSearch,
    suggestions,
    filters,
    setFilters,
    resetFilters,
    filteredCourses,
  } = useDashboardCourses();

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
                  <Col xs={12} sm={6}>
                    <Select
                      value={filters.students}
                      onChange={(v) => setFilters((f) => ({ ...f, students: v }))}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Any Number of Students' },
                        { value: 'lt500', label: 'Less than 500 Students' },
                        { value: '500_2000', label: '500 – 2,000 Students' },
                        { value: '2000_10000', label: '2,000 – 10,000 Students' },
                        { value: 'gt10000', label: 'More than 10,000 Students' },
                      ]}
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <Select
                      value={filters.duration}
                      onChange={(v) => setFilters((f) => ({ ...f, duration: v }))}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Any Duration' },
                        { value: 'lt5', label: 'Less than 5 Hours' },
                        { value: '5_10', label: '5 – 10 Hours' },
                        { value: '10_20', label: '10 – 20 Hours' },
                        { value: 'gt20', label: 'More than 20 Hours' },
                      ]}
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <Select
                      value={filters.price}
                      onChange={(v) => setFilters((f) => ({ ...f, price: v }))}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Any Price' },
                        { value: 'free', label: 'Free' },
                        { value: 'lt50', label: 'Under $50' },
                        { value: '50_100', label: '$50 – $100' },
                        { value: '100_200', label: '$100 – $200' },
                        { value: 'gt200', label: 'Above $200' },
                      ]}
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <Select
                      value={filters.rating}
                      onChange={(v) => setFilters((f) => ({ ...f, rating: v }))}
                      className="filter-select"
                      options={[
                        { value: 'any', label: 'Any Rating' },
                        { value: 'gte35', label: '4★ & Above' },
                        { value: 'gte40', label: '4.0★ & Above' },
                        { value: 'gte45', label: '4.5★ & Above' },
                      ]}
                    />
                  </Col>

                  <Col xs={24}>
                    <Flex justify="flex-end">
                      <Button type="default" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    </Flex>
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
            <Flex
              className="courses-grid__empty"
              justify="center"
              align="center"
            >
              <Empty description="No courses found" />
            </Flex>
          )}
        </div>


      </div>

    </div>
  );
};

export default DashboardHome;
