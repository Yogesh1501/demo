import React, { useState } from 'react';
import axios from 'axios';
import './AddMaintenance.css';

const AddMaintenance = ({ flatNumber, onClose }) => {
  const [userName, setUserName] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [snapshot, setSnapshot] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!userName || !amountPaid || !paymentMonth || !snapshot) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('user_name', userName);
    formData.append('flat_number', flatNumber);
    formData.append('amount_paid', amountPaid);
    formData.append('payment_month', paymentMonth);
    formData.append('snapshot', snapshot);

    try {
      const response = await axios.post('http://127.0.0.1:5000/add_maintenance', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        alert(response.data.message);
        onClose(); // Close the modal on success
      } else {
        alert('Failed to add maintenance. Please try again.');
      }
    } catch (error) {
      console.error('Error adding maintenance:', error);
      alert('An error occurred while adding maintenance.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="AddMaintenance-form">
      <div className="AddMaintenance-form-title">Add Maintenance</div>

      <div className="form-group">
        <label htmlFor="userName">Name:</label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="flatNumber">Flat Number:</label>
        <input
          id="flatNumber"
          type="text"
          value={flatNumber}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="amountPaid">Amount Paid:</label>
        <input
          id="amountPaid"
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="Enter amount paid"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="paymentMonth">Payment Month:</label>
        <input
          id="paymentMonth"
          type="month"
          value={paymentMonth}
          onChange={(e) => setPaymentMonth(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="snapshot">Payment Snapshot:</label>
        <input
          id="snapshot"
          type="file"
          onChange={(e) => setSnapshot(e.target.files[0])}
          required
        />
      </div>

      <div className="button-group">
        <button type="submit" className="AddMaintenance-button">
          Add Maintenance
        </button>
        <button
          type="button"
          onClick={onClose}
          className="AddMaintenance-close"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddMaintenance;
