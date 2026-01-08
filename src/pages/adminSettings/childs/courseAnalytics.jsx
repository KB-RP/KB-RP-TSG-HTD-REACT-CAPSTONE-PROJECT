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
  Tooltip,
  Legend
} from 'recharts';
import * as htmlToImage from 'html-to-image';

const { Text } = Typography;

const MAX_SELECTION = 7;

const CourseAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const res = await courseAPI.getCourses();
        setCourses(Array.isArray(res) ? res : []);
      } catch {
        message.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
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
    if (selectedCourses.length === 0) return [];

    const maxStudents = Math.max(...selectedCourses.map(c => c.students || 0));
    const maxDuration = Math.max(...selectedCourses.map(c => c.duration || 0));
    const maxPrice = Math.max(...selectedCourses.map(c => c.price || 0));
    const maxRating = 5;

    return selectedCourses.map(c => ({
      label: c.title,

      students: ((c.students || 0) / maxStudents) * 100,
      duration: ((c.duration || 0) / maxDuration) * 100,
      price: ((c.price || 0) / maxPrice) * 100,
      rating: ((c.rating || 0) / maxRating) * 100,

      // keep originals for tooltip
      _students: c.students,
      _duration: c.duration,
      _price: c.price,
      _rating: c.rating
    }));
  }, [selectedCourses]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
      <div style={{ background: '#fff', padding: 12, border: '1px solid #ddd' }}>
        <strong>{label}</strong>
        <div>👥 Students: {data._students}</div>
        <div>⏱ Duration: {data._duration} hrs</div>
        <div>💲 Price: ${data._price}</div>
        <div>⭐ Rating: {data._rating}</div>
      </div>
    );
  };

  const handleChange = (vals) => {
    if (vals.length > MAX_SELECTION) {
      message.warning(`You can select maximum ${MAX_SELECTION} courses`);
      return;
    }
    setSelectedIds(vals);
  };

  const removeSelection = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== String(id)));
  };

  const handleView = () => {
    if (!selectedIds.length) {
      message.info('Please select at least one course');
      return;
    }
    setShowChart(true);
  };

  const downloadPng = async () => {
    if (!chartRef.current) {
      message.error('Chart not ready');
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = 'course-analytics.png';
      link.href = dataUrl;
      link.click();
    } catch {
      message.error('Failed to export PNG');
    }
  };



  return (
    <Card title="Course Analytics" loading={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>Select up to {MAX_SELECTION} courses</Text>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Search and select courses"
              options={options}
              value={selectedIds}
              onChange={handleChange}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
        </Row>

        {/* Selected course tags */}
        <Space wrap>
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
        </Space>

        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={handleView}>
            View Analysis
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadPng}
            disabled={!showChart || !selectedCourses.length}
          >
            Download PNG
          </Button>
        </Space>

        <Divider />

        <div ref={chartRef}>
          {showChart && chartData.length ? (
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={chartData} barCategoryGap={30}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="students" name="Students" fill="#1677ff" />
                <Bar dataKey="duration" name="Duration" fill="#faad14" />
                <Bar dataKey="price" name="Price" fill="#eb2f96" />
                <Bar dataKey="rating" name="Rating" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty description="No analysis to display" />
          )}
        </div>
      </Space>
    </Card>
  );
};

export default CourseAnalytics;
