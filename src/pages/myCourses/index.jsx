import React, { useEffect } from 'react'
import { courseAPI } from '../../utils/api/courseApi';
import { useAuth } from '../../contexts';

const MyCourses = () => {
const {user} = useAuth();
    const fetchAllSubscriptions = async () => {
        const res = await courseAPI.getEnrolledCourse(user?.id);
        console.log("res", res);
      }

      useEffect(()=>{
        fetchAllSubscriptions();
      })
  return (
    <div>
      <h1>My Courses Page</h1>
    </div>
  )
}

export default MyCourses
