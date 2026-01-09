import { Form, message, Modal } from 'antd';
import React from 'react'
import CourseForm from '../../components/course/CourseForm';
import { courseAPI } from '../../utils/api/courseApi';

const EditCourseModal = ({ editingCourse, editFormVisible, setEditFormVisible, fetchCourses, loading, setLoading }) => {
    const [form] = Form.useForm();
  return (
    <>
      <Modal
        title={`Edit Course: ${editingCourse?.title}`}
        open={editFormVisible}
        onCancel={() => setEditFormVisible(false)}
        footer={null}
        width={1200}
      >
        <CourseForm
          initialValues={editingCourse}
          isEdit={true}
          onFinish={async (values) => {
            try {
              setLoading(true);
              await courseAPI.updateCourse(editingCourse.id, values);
              message.success('Course updated successfully!');
              fetchCourses(); // Refresh the course list
              setEditFormVisible(false);
            } catch (error) {
              message.error('Failed to update course');
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
          loading={loading}
          form={form}
        />
      </Modal>
    </>
  )
}

export default EditCourseModal
