import React, { useState } from 'react';

const MaintenanceForm = () => {
  const [flatId, setFlatId] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const maintenanceData = {
      flatId,
      date,
      amount,
      month,
    };

    try {
      const response = await fetch('/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setError('');
      } else {
        setMessage('');
        setError(result.error);
      }
    } catch (err) {
      setMessage('');
      setError('Error occurred while adding maintenance');
    }
  };

  return (
    <div>
      <h2>Add Maintenance</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Flat ID:</label>
          <input
            type="text"
            value={flatId}
            onChange={(e) => setFlatId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Month:</label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Maintenance</button>
      </form>
    </div>
  );
};

export default MaintenanceForm;
