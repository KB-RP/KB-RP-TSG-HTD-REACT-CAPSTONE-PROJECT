// src/pages/adminSettings/childs/CourseForm.jsx
import React, { useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Tooltip,

} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const CourseForm = ({ initialValues, onFinish, loading, isEdit = false, form }) => {

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const useCategoryOptions = () =>
    useMemo(
      () => [
        {
          value: 'Web Development',
          label: 'Web Development',

        },
        {
          value: 'Mobile Development',
          label: 'Mobile Development',

        },
        {
          value: 'UI/UX Design',
          label: 'UI/UX Design',

        },
        {
          value: 'Data Science',
          label: 'Data Science',

        },
        {
          value: 'Cloud & DevOps',
          label: 'Cloud & DevOps',

        },
        {
          value: 'Cyber Security',
          label: 'Cyber Security',

        },
        {
          value: 'Business & Management',
          label: 'Business & Management',

        }
      ],
      []
    );

  const categoryOptions = useCategoryOptions();


  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const formattedPayload = {
          ...values,
          modules: values.modules.map((m, mIndex) => ({
            id: m.id || `${mIndex + 1}`,
            title: m.title,
            description: m.description,
            lessons: m.lessons.map((l, lIndex) => ({
              id: `${mIndex + 1}-${lIndex + 1}`,
              title: l.title,
              duration: l.duration,
              type: 'video',
              summary: l.summary
            }))
          }))
        };
        onFinish(formattedPayload);
      }}
      initialValues={{
        level: 'Beginner',
        category: 'Web Development',
        rating: 0,
        students: 0,
        modules: [
          {
            title: '',
            description: '',
            lessons: [{ title: '', duration: 10, summary: '' }]
          }
        ]
      }}
    >
      <Row gutter={[24, 24]}>
        {/* LEFT SECTION */}
        <Col xs={24} lg={16}>
          <Card title="Course Information">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="title" label="Course Title" rules={[{ required: true, message: 'Course title is required' }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="instructor" label="Instructor" rules={[{ required: true, message: 'Instructor name is required' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Course description is required' }]}>
              <TextArea rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Enter course price' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Price"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="originalPrice"
                  label="Original Price"
                  tooltip="Original price before discount"
                  rules={[{ required: true, message: 'Original price is required' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Original Price"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="students"
                  label="Students"
                  rules={[{ required: true, message: 'Enter students count' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Students Enrolled"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="rating"
                  label="Rating (0–5)"
                  rules={[
                    { required: true, message: 'Enter rating' },
                    { type: 'number', min: 0, max: 5, message: 'Rating must be between 0 and 5' }
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={5}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="e.g. 4.7"
                  />
                </Form.Item>
              </Col>
            </Row>


            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="duration"
                  label="Duration (hrs)"
                  tooltip="Total course duration in hours"
                  rules={[
                    { required: true, message: 'Enter course duration' },
                    { type: 'number', min: 1, message: 'Duration must be at least 1 hour' }
                  ]}
                >
                  <InputNumber
                    min={1}
                    step={0.5}
                    style={{ width: '100%' }}
                    placeholder="e.g. 12"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="level"
                  label="Level"
                  rules={[{ required: true, message: 'Please select course level' }]}
                >
                  <Select placeholder="Select level">
                    <Option value="Beginner">Beginner</Option>
                    <Option value="Intermediate">Intermediate</Option>
                    <Option value="Advanced">Advanced</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select course category' }]}
                >
                  <Select placeholder="Select category">
                    {categoryOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        <Tooltip title={option.label}>
                          {option.label}
                        </Tooltip>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>



          </Card>

          {/* MODULES */}
          <Card
            title="Modules & Lessons"
            style={{ marginTop: 16 }}
            extra={
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() =>
                  form.setFieldValue('modules', [
                    ...form.getFieldValue('modules'),
                    { title: '', description: '', lessons: [{ title: '', duration: 10, summary: '' }] }
                  ])
                }
              >
                Add Module
              </Button>
            }
          >
            <Form.List name="modules">
              {(modules, { remove }) =>
                modules.map((module, mIndex) => (
                  <Card
                    key={module.key}
                    type="inner"
                    title={`Module ${mIndex + 1}`}
                    extra={<DeleteOutlined onClick={() => remove(mIndex)} />}
                    style={{ marginBottom: 16 }}
                  >
                    <Form.Item name={[module.name, 'title']} label="Module Title" rules={[{ required: true, message: 'Module title is required' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name={[module.name, 'description']} label="Module Description" rules={[{ required: true, message: 'Module description is required' }]}>
                      <TextArea rows={2} />
                    </Form.Item>

                    <Form.List name={[module.name, 'lessons']}>
                      {(lessons, { add, remove }) => (
                        <>
                          {lessons.map((lesson, lIndex) => (
                            <Row gutter={12} key={lesson.key}>
                              <Col xs={24} md={8}>
                                <Form.Item
                                  name={[lesson.name, 'title']}
                                  label="Lesson Title"
                                  rules={[{ required: true, message: 'Lesson title is required' }]}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>

                              <Col xs={12} md={4}>
                                <Form.Item
                                  name={[lesson.name, 'duration']}
                                  label="Duration"
                                  rules={[{ required: true, message: 'Lesson duration is required' }]}
                                  tooltip="Duration should be in minutes"
                                >
                                  <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={10}>
                                <Form.Item
                                  name={[lesson.name, 'summary']}
                                  label="Lesson Summary"
                                  rules={[{ required: true, message: 'Lesson summary is required' }]}
                                >
                                  <TextArea rows={2} />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={2} style={{ marginTop: 30 }}>
                                <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(lIndex)} />
                              </Col>
                            </Row>
                          ))}

                          <Button type="dashed" block onClick={() => add()}>
                            + Add Lesson
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))
              }
            </Form.List>
          </Card>
        </Col>

        {/* RIGHT SECTION */}
        <Col xs={24} lg={8}>
          <Card title="Media">
            <Form.Item name="thumbnail" label="Thumbnail URL" rules={[{ required: true, message: 'Thumbnail URL is required' }]}>
              <Input placeholder="https://img.youtube.com/vi/xxxx/maxresdefault.jpg" />
            </Form.Item>

            <Form.Item name="vdoLink" label="Course Video Link" rules={[{ required: true, message: 'Course video link is required' }]}>
              <Input placeholder="https://youtu.be/xxxx" />
            </Form.Item>
          </Card>

          <Card title="Learning Objectives" style={{ marginTop: 16 }}>
            <Form.List name="learningObjectives">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} style={{ display: 'flex' }}>
                      <Form.Item {...field} rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" block onClick={() => add()}>
                    Add Objective
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            style={{ marginTop: 24 }}
          >
            {isEdit ? 'Update Course' : 'Create Course'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CourseForm;
