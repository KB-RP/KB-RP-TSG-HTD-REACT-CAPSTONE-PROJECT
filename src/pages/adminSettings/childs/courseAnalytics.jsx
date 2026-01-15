import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  Select,
  Button,
  Row,
  Col,
  Tag,
  Space,
  Empty,
  message,
  Typography,
  Divider
} from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { courseAPI } from '../../../utils/api/courseApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import * as htmlToImage from 'html-to-image';

const { Text } = Typography;
const MAX_SELECTION = 7;

const KPI_OPTIONS = [
  { label: 'Students', value: 'students' },
  { label: 'Rating', value: 'rating' },
  { label: 'Duration (hrs)', value: 'duration' },
  { label: 'Price ($)', value: 'price' }
];

const CourseAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState('students');
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

  const courseOptions = useMemo(
    () =>
      courses.map((c) => ({
        label: c.title,
        value: String(c.id)
      })),
    [courses]
  );

  const selectedCourses = useMemo(
    () => courses.filter((c) => selectedIds.includes(String(c.id))),
    [courses, selectedIds]
  );

  const chartData = useMemo(() => {
    return selectedCourses.map((c) => ({
      name: c.title,
      value: c[selectedKpi] ?? 0
    }));
  }, [selectedCourses, selectedKpi]);

  const handleCourseChange = (vals) => {
    if (vals.length > MAX_SELECTION) {
      message.warning(`You can select maximum ${MAX_SELECTION} courses`);
      return;
    }
    else {
      setSelectedIds(vals);
    }
  };

  const handleView = () => {
    if (!selectedIds.length) {
      message.info('Please select at least one course');
      return;
    }
    setShowChart(true);
  };

  const downloadPng = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(chartRef.current, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
        });

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'course-analytics.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('PNG export failed:', error);
        message.error('Failed to export PNG');
      }
    } else {
      message.error('Chart is not available for export');
    }
  };


  return (
    <Card title="Course Analytics" loading={loading}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Text strong>Select Courses (max {MAX_SELECTION})</Text>
            <Select
              mode="multiple"
              showSearch
              allowClear
              options={courseOptions}
              value={selectedIds}
              onChange={handleCourseChange}
              placeholder="Search and select courses"
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>

          <Col xs={24} md={8}>
            <Text strong>Select KPI</Text>
            <Select
              value={selectedKpi}
              options={KPI_OPTIONS}
              onChange={setSelectedKpi}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
        </Row>

        {/* Selected tags */}
        <Space wrap>
          {selectedCourses.map((c) => (
            <Tag
              key={c.id}
              closable
              onClose={() =>
                setSelectedIds((prev) =>
                  prev.filter((id) => id !== String(c.id))
                )
              }
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
            disabled={!showChart}
            onClick={downloadPng}
          >
            Download PNG
          </Button>
        </Space>

        <Divider />

        <div ref={chartRef}>
          {showChart && chartData.length ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1677ff" />
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

export default memo(CourseAnalytics);
