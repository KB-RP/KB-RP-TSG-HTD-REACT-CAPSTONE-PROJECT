import React, { useState } from 'react';
import { Tabs, Card, Button, Typography } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import './AdminSettings.scss';
import AddCourse from './childs/addCourse';
import ManageCourses from './childs/manageCourses';
import CourseAnalytics from './childs/courseAnalytics';

const { TabPane } = Tabs;
const { Title } = Typography;

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="admin-settings">
      <div className="admin-header">
        <Title level={2}>Admin Settings</Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="admin-tabs"
        type="card"
      >
        <TabPane
          tab={
            <span>
              <PlusOutlined />
              Add Course
            </span>
          }
          key="1"
        >
          <AddCourse />
        </TabPane>

        <TabPane
          tab={
            <span>
              <EditOutlined />
              Manage Courses
            </span>
          }
          key="2"
        >
          <ManageCourses />
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Course Analytics
            </span>
          }
          key="3"
        >
          <CourseAnalytics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminSettings;