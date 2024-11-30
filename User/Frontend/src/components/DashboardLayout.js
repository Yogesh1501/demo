import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import "./DashboardLayout.css";
import RightSide from './RightSide/RightSide.jsx';

const DashboardLayout = ({ children, isDashboard }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('roles'));
    const userRole = user ? user.role : null;
    if (user) {
      setUserRole(user.role); // Set role to either 'admin' or 'user'
    }
    console.log('User role:', userRole); // Debugging the role
  }, []);

  return (
    <div className="app">
      <div className={`AppGlass ${isDashboard ? 'grid-3' : 'grid-2'}`}>
        {userRole && <Sidebar userRole={userRole} />}
        <div className="dashboard-content">
          {children}
        </div>
        {isDashboard && <RightSide />}
      </div>
    </div>
  );
};

export default DashboardLayout;
