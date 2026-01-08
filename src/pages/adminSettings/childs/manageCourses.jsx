import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, message, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../../utils/api/courseApi';
import CourseForm from '../../../components/course/CourseForm';
import EditCourseModal from '../../../modal/editCourse';

const { Search } = Input;
const { Text } = Typography;

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseAPI.getCourses();
      // Transform the data to match our table structure
      const formattedCourses = res.map(course => ({
        ...course,
        key: course.id,
        totalLessons: course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0),
        totalDuration: course.duration // Assuming duration is in hours
      }));
      setCourses(formattedCourses);
    } catch (error) {
      message.error('Failed to fetch courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setEditFormVisible(true);
  };

  const handleDelete = async (courseId) => {
    try {
      // TODO: Replace with actual API call
      // await courseAPI.deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      message.success('Course deleted successfully');
    } catch (error) {
      message.error('Failed to delete course');
      console.error(error);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchText) ||
    course.instructor.toLowerCase().includes(searchText) ||
    course.category.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Tooltip title={text}>
          <div className="course-title-cell" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px'
              }}>
                {text}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>By {record.instructor}</div>
            </div>
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Web Development', value: 'Web Development' },
        { text: 'JavaScript', value: 'JavaScript' },
        { text: 'UI/UX Design', value: 'UI/UX Design' },
        { text: 'Data Science', value: 'Data Science' },
        { text: 'DevOps', value: 'DevOps' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `${rating}/5.0`,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (students) => students.toLocaleString(),
      sorter: (a, b) => a.students - b.students,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <div>
          <div>${price.toFixed(2)}</div>
          {record.originalPrice > price && (
            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: 12 }}>
              ${record.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <div>
          <div>{record.totalDuration} hours</div>
          <div>{record.totalLessons} lessons</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 140, // Increased from 120 to 140
      render: (_, record) => (
        <Space size={0} style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <Link to={`/courses/${record.id}?tab=overview`}>
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                style={{ padding: '4px 8px' }} // Added padding
              />
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ padding: '4px 8px' }} // Added padding
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                style={{ padding: '4px 8px' }} // Added padding
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <div className="manage-courses">
      <div className="manage-courses__header" style={{ marginBottom: 24 }}>
        <h2>Manage Courses</h2>
        <Search
          placeholder="Search courses, instructors..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`
        }}
        scroll={{ x: 'max-content' }}
        style={{ width: '100%' }}
        bordered
      />
        <EditCourseModal editingCourse ={editingCourse} editFormVisible ={editFormVisible} setEditFormVisible={setEditFormVisible} fetchCourses={fetchCourses} loading={loading} setLoading={setLoading}/>
    </div>
  );
};

export default ManageCourses;