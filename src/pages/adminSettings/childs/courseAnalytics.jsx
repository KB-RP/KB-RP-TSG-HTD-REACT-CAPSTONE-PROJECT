import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Select, Button, Row, Col, Tag, Space, Empty, message, Typography, Divider } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { courseAPI } from '../../../utils/api/courseApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

const { Option } = Select;
const { Title, Text } = Typography;

// Recharts-based chart wrapper
const RechartsBar = ({ data, dataKey, height = 360 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 32 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={0} angle={-10} textAnchor="end" height={60} />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey={dataKey} name={dataKey} fill="#1677ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const MAX_SELECTION = 7;

const CourseAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [metric, setMetric] = useState('students');
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await courseAPI.getCourses();
        setCourses(Array.isArray(res) ? res : []);
      } catch (e) {
        message.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const options = useMemo(
    () =>
      courses.map((c) => ({
        label: c.title,
        value: String(c.id),
      })),
    [courses]
  );

  const selectedCourses = useMemo(
    () => courses.filter((c) => selectedIds.includes(String(c.id))),
    [courses, selectedIds]
  );

  const chartData = useMemo(() => {
    const key = metric;
    return selectedCourses.map((c) => ({
      id: c.id,
      label: c.title,
      [key]: Number(c[key]) || 0,
    }));
  }, [selectedCourses, metric]);

  const handleChange = (vals) => {
    if (vals.length > MAX_SELECTION) {
      message.warning(`You can select maximum ${MAX_SELECTION} courses`);
      return; // ignore until user removes
    }
    setSelectedIds(vals);
  };

  const removeSelection = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== String(id)));
  };

  const handleView = () => {
    if (selectedIds.length === 0) {
      message.info('Please select at least one course');
      return;
    }
    setShowChart(true);
    // Slight delay to ensure canvas renders before snapshot if needed
    setTimeout(() => {}, 0);
  };

  // Convert Recharts SVG to PNG
  const downloadPng = async () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) {
      message.error('Chart not ready to download');
      return;
    }
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    const bbox = svg.getBoundingClientRect();
    canvas.width = Math.max(800, Math.floor(bbox.width));
    canvas.height = Math.max(400, Math.floor(bbox.height));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    URL.revokeObjectURL(url);
    const link = document.createElement('a');
    link.download = `course-analysis-${metric}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="course-analytics">
      <Card title="Course Analytics" loading={loading}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Text strong>Select up to {MAX_SELECTION} courses</Text>
              <Select
                mode="multiple"
                allowClear
                placeholder="Search and select courses"
                value={selectedIds}
                onChange={handleChange}
                style={{ width: '100%', marginTop: 8 }}
                maxTagCount="responsive"
                options={options}
                showSearch
                optionFilterProp="label"
              />
            </Col>
            <Col xs={24} md={8}>
              <Text strong>Metric</Text>
              <Select value={metric} onChange={setMetric} style={{ width: '100%', marginTop: 8 }}>
                <Option value="students">Students</Option>
                <Option value="rating">Rating</Option>
                <Option value="duration">Duration (hrs)</Option>
                <Option value="price">Price ($)</Option>
              </Select>
            </Col>
          </Row>

          {/* Capsules for selected */}
          <div>
            <Space wrap size={[8, 8]}>
              {selectedCourses.map((c) => (
                <Tag
                  key={c.id}
                  color="blue"
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    removeSelection(c.id);
                  }}
                >
                  {c.title}
                </Tag>
              ))}
              {selectedCourses.length === 0 && <Text type="secondary">No courses selected</Text>}
            </Space>
          </div>

          <Space>
            <Button type="primary" icon={<EyeOutlined />} onClick={handleView}>
              View Analysis
            </Button>
            <Button icon={<DownloadOutlined />} onClick={downloadPng} disabled={!showChart || selectedCourses.length === 0}>
              Download Analysis
            </Button>
          </Space>

          <Divider style={{ margin: '12px 0' }} />

          <div ref={chartRef}>
            {showChart && selectedCourses.length > 0 ? (
              <RechartsBar data={chartData} dataKey={metric} height={360} />
            ) : (
              <Empty description="No analysis to display" />
            )}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CourseAnalytics;

