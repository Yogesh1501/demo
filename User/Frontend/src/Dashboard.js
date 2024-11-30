import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Add some styles for better UI
import React from "react";
import Cards from "../Cards/Cards";  // Your card component that displays key statistics
import Table from "../Table/Table";  // Your table component for logs/reports


const Dashboard = () => {
  return (
    
    <div className="MainDash">
      <h1>Society Management Dashboard</h1>
      <Cards />  
      <h2>Recent Complaints</h2>
      {/* <Table />    */}
    </div>
    
  );
};

export default Dashboard;
