import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintenanceSummary = () => {
  const [maintenanceData, setMaintenanceData] = useState({ overall: 0, paid: 0, pending: 0 });
  const [formData, setFormData] = useState({ maintenance_id: '', updated_amount: '' });

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get('/api/maintenance');
      setMaintenanceData(response.data);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/update_maintenance', formData);
      alert("Maintenance updated successfully!");
      fetchMaintenanceData();
    } catch (error) {
      console.error("Error updating maintenance:", error);
    }
  };

  return (
    <div className="maintenance-summary">
      <div className="card">
        <h3>Overall Maintenance</h3>
        <p>${maintenanceData.overall.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Paid Maintenance</h3>
        <p>${maintenanceData.paid.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Pending Maintenance</h3>
        <p>${maintenanceData.pending.toFixed(2)}</p>
      </div>

      <form onSubmit={handleUpdate}>
        <h4>Update Maintenance</h4>
        <input
          type="text"
          name="maintenance_id"
          placeholder="Maintenance ID"
          value={formData.maintenance_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="updated_amount"
          placeholder="Updated Amount"
          value={formData.updated_amount}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default MaintenanceSummary;
