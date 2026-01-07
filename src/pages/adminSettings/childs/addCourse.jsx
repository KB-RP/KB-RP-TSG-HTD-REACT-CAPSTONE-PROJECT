import React, { useState } from 'react';
import { Card, message } from 'antd';
import { courseAPI } from '../../../utils/api/courseApi';
import CourseForm from '../../../components/course/CourseForm';

const AddCourse = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Remove id if it exists (in case of edit)
      const { id, ...courseData } = values;
      await courseAPI.createCourse(courseData);
      message.success('Course created successfully!');
      // You might want to redirect or refresh the course list
    } catch (error) {
      message.error('Failed to create course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add New Course">
      <CourseForm
        onFinish={handleSubmit}
        loading={loading}
      />
    </Card>
  );
};

export default AddCourse;