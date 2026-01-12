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
                    <Flex justify="flex-end">
                      <Button
                        type="default"
                        onClick={resetFilters}
                      >
                        Clear
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
