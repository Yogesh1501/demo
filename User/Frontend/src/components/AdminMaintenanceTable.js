import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMaintenanceTable.css';

const AdminMaintenanceTable = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get_maintenance_records');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching maintenance records', error);
      }
    };
    fetchRecords();
  }, []);

  return (
    <table className="AdminMaintenanceTable-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Flat Number</th>
          <th>Amount Paid</th>
          <th>Payment Month</th>
          <th>Payment Date</th>
          <th>Snapshot</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{record.user_name}</td>
            <td>{record.flat_number}</td>
            <td>{record.amount_paid}</td>
            <td>
                  {new Date(record.payment_month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </td>
            <td>{new Date(record.payment_date).toLocaleString()}</td>
            <td>
              <img
                src={`http://127.0.0.1:5000/uploads/${record.payment_snapshot}`}
                alt="Snapshot"
                className="mti-thumb"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminMaintenanceTable;
