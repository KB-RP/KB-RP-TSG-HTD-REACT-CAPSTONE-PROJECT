import { Modal } from 'antd';
import React from 'react'
import CourseForm from '../../components/course/CourseForm';

const EditCourseModal = ({ editingCourse, editFormVisible, setEditFormVisible, fetchCourses, loading, setLoading }) => {
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
              setEditFormVisible(false);
              fetchCourses(); // Refresh the course list
            } catch (error) {
              message.error('Failed to update course');
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
          loading={loading}
        />
      </Modal>
    </>
  )
}

export default EditCourseModal
