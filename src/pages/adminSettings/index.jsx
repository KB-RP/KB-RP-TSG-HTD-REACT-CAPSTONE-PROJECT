import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { PlusOutlined, EditOutlined ,BarChartOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import AddCourse from './childs/addCourse';
import ManageCourses from './childs/manageCourses'; // Make sure to import your ManageCourses component
import CourseAnalytics from './childs/courseAnalytics';
import   '../../styles/adminSettings/adminSettings.scss';
const { TabPane } = Tabs;

const AdminSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1'); // Default to first tab

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['1', '2' , '3'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`?tab=${key}`, { replace: true });
  };

  return (
    <div className="admin-settings">
      <div className="admin-header">
        <h2>Admin Settings</h2>
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