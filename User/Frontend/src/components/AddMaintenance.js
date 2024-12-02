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
      alert(response.data.message);
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error('Error adding maintenance', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="AddMaintenance-form">
      <div className="AddMaintenance-form-title">Add Maintenance</div>
      <div>
        <label>Name:</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div>
        <label>Flat Number:</label>
        <input type="text" value={flatNumber} readOnly />
      </div>
      <div>
        <label>Amount Paid:</label>
        <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} required />
      </div>
      <div>
        <label>Payment Month:</label>
        <input type="month" value={paymentMonth} onChange={(e) => setPaymentMonth(e.target.value)} required />
      </div>
      <div>
        <label>Payment Snapshot:</label>
        <input type="file" onChange={(e) => setSnapshot(e.target.files[0])} required />
      </div>
      <button type="submit" className="AddMaintenance-button">Add Maintenance</button>
      <button type="button" onClick={onClose} className="AddMaintenance-close">Cancel</button>
    </form>
  );
};

export default AddMaintenance;
