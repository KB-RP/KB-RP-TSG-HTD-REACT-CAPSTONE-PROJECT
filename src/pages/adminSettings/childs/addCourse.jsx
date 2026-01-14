import React, { memo, useState } from 'react';
import { Card, message, Form } from 'antd';
import { courseAPI } from '../../../utils/api/courseApi';
import CourseForm from '../../../components/course/CourseForm';

const AddCourse = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { id, ...courseData } = values;
      await courseAPI.createCourse(courseData);
      message.success('Course created successfully!');
      // Reset form after successful submission
      form.resetFields();
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
        form={form}
      />
    </Card>
  );
};

export default memo(AddCourse);