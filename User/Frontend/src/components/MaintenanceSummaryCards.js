import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaintenanceSummaryCards.css';

const MaintenanceSummaryCards = () => {
  const [summary, setSummary] = useState({
    total_maintenance: 0,
    paid_maintenance: 0,
    pending_maintenance: 0,
    current_month: '',
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/maintenance_summary_cards');
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching maintenance summary:', error);
      }
    };

    fetchSummary();
  }, []);

  const formatNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) ? num.toFixed(2) : '0.00'; // Returns '0.00' if value is not a valid number
  };

  return (
    <>
    <h2>{summary.current_month}</h2>
    <div className="maintenance-summary-cards">
     
      <div className="card">
        <h3>Total Maintenance </h3>
        <p>${formatNumber(summary.total_maintenance)}</p>
      </div>
      <div className="card">
        <h3>Paid Maintenance</h3>
        <p>${formatNumber(summary.paid_maintenance)}</p>
      </div>
      <div className="card">
        <h3>Pending Maintenance </h3>
        <p>${formatNumber(summary.pending_maintenance)}</p>
      </div>
    </div>
    </>
  );
};

export default MaintenanceSummaryCards;
