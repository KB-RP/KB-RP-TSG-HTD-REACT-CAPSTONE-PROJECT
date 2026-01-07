// src/pages/adminSettings/childs/CourseForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Space,
  Divider,
  Card,
  Row,
  Col,
  Typography
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const CourseForm = ({ initialValues, onFinish, loading, isEdit = false }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Format modules for form fields
        modules: initialValues.modules?.map(module => ({
          ...module,
          lessons: module.lessons?.map(lesson => ({
            ...lesson,
            key: lesson.id
          }))
        })) || [{ title: '', lessons: [{ title: '', duration: 30 }] }]
      });
      
      if (initialValues.thumbnail) {
        setFileList([{
          uid: '-1',
          name: 'thumbnail',
          status: 'done',
          url: initialValues.thumbnail,
        }]);
      }
    }
  }, [initialValues, form]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
    return isImage && isLt2M;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        // Format the values to match the expected API structure
        const formattedValues = {
          ...values,
          thumbnail: fileList[0]?.url || fileList[0]?.thumbUrl || '',
          modules: values.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson => ({
              title: lesson.title,
              duration: lesson.duration
            }))
          }))
        };
        onFinish(formattedValues);
      }}
      onFinishFailed={onFinishFailed}
      initialValues={{
        level: 'Beginner',
        category: 'Web Development',
        modules: [{ title: '', lessons: [{ title: '', duration: 30 }] }]
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={16}>
          <Card title="Course Information">
            <Form.Item
              name="title"
              label="Course Title"
              rules={[{ required: true, message: 'Please enter course title' }]}
            >
              <Input placeholder="e.g., Advanced React Development" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter course description' }]}
            >
              <TextArea rows={4} placeholder="Enter detailed course description" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select placeholder="Select category">
                    <Option value="Web Development">Web Development</Option>
                    <Option value="Mobile Development">Mobile Development</Option>
                    <Option value="UI/UX Design">UI/UX Design</Option>
                    <Option value="Data Science">Data Science</Option>
                    <Option value="Business">Business</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="level"
                  label="Level"
                  rules={[{ required: true, message: 'Please select level' }]}
                >
                  <Select>
                    <Option value="Beginner">Beginner</Option>
                    <Option value="Intermediate">Intermediate</Option>
                    <Option value="Advanced">Advanced</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Price ($)"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="originalPrice"
                  label="Original Price ($)"
                  rules={[{ required: true, message: 'Please enter original price' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            title="Course Content"
            style={{ marginTop: 16 }}
            extra={
              <Button
                type="dashed"
                onClick={() => {
                  const modules = form.getFieldValue('modules') || [];
                  form.setFieldsValue({
                    modules: [...modules, { title: '', lessons: [{ title: '', duration: 30 }] }]
                  });
                }}
                icon={<PlusOutlined />}
              >
                Add Module
              </Button>
            }
          >
            <Form.List name="modules">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ marginBottom: 24, border: '1px solid #f0f0f0', padding: 16, borderRadius: 4 }}>
                      <Row gutter={16} align="middle">
                        <Col flex="auto">
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            rules={[{ required: true, message: 'Module title is required' }]}
                            style={{ marginBottom: 8 }}
                          >
                            <Input placeholder="Module Title" />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>

                      <Form.List name={[name, 'lessons']}>
                        {(lessons, { add: addLesson, remove: removeLesson }) => (
                          <>
                            {lessons.map((lesson, index) => (
                              <Row key={lesson.key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                <Col span={12}>
                                  <Form.Item
                                    {...lesson}
                                    name={[lesson.name, 'title']}
                                    rules={[{ required: true, message: 'Lesson title is required' }]}
                                    noStyle
                                  >
                                    <Input placeholder="Lesson Title" />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    {...lesson}
                                    name={[lesson.name, 'duration']}
                                    rules={[{ required: true, message: 'Duration is required' }]}
                                    noStyle
                                  >
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      min={1}
                                      placeholder="Duration (min)"
                                      addonAfter="min"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Button
                                    type="text"
                                    danger
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => removeLesson(lesson.name)}
                                    disabled={lessons.length === 1}
                                  />
                                </Col>
                              </Row>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => addLesson({ title: '', duration: 30 }, lessons.length)}
                              block
                              icon={<PlusOutlined />}
                              style={{ marginTop: 8 }}
                            >
                              Add Lesson
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Thumbnail">
            <Form.Item
              name="thumbnail"
              rules={[{ required: !isEdit, message: 'Please upload a thumbnail' }]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                maxCount={1}
                accept="image/*"
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Card>

          <Card title="Learning Objectives" style={{ marginTop: 16 }}>
            <Form.List name="learningObjectives">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[{ required: true, message: 'Please enter an objective' }]}
                        style={{ marginBottom: 0, flex: 1 }}
                      >
                        <Input placeholder="Enter learning objective" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Objective
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              {isEdit ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default CourseForm;