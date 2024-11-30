import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./flatForm.css";

const FlatForm = ({ flatData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    flatNumber: '',
    blockNumber: '',
    ownerName: '',
    ownerContact: '',
    residents: 1,
    flatType: '2BHK',
    status: 'Vacant',
    rentType: '',
    startDate: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (flatData) {
      setFormData(flatData);
    }
  }, [flatData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.flatNumber) errors.flatNumber = 'Flat Number is required';
    if (!formData.ownerName) errors.ownerName = 'Owner Name is required';
    if (!formData.ownerContact) errors.ownerContact = 'Owner Contact is required';
    if (!formData.status) errors.status = 'Status is required';
    if (!formData.rentType) errors.rentType = 'Rent/Ownership Information is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://127.0.0.1:5000/flatForm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flatNumber: formData.flatNumber,
            blockNumber: formData.blockNumber,
            ownerName: formData.ownerName,
            ownerContact: formData.ownerContact,
            residents: formData.residents,
            flatType: formData.flatType,
            status: formData.status,
            rentType: formData.rentType,
            startDate: formData.startDate,
        }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Unknown error occurred');
      }

      const result = await response.json();
      alert('Flat added successfully');

        // const result = await response.json();

        if (result.success) {
          // Redirect to FlatsList page after successful submission
          navigate('/flats');
        } else {
          setErrors(result.errors);
        }
      } catch (error) {
        console.error('Error submitting flat:', error);
        alert('Error: ' + error.message);
    }
    }
  };

  return (
    <div 
    style={{ padding: '20px', 
      // backgroundColor: '#f4f6f8' 
    }}
    >
      <h2 className='fhstyle'>{flatData ? 'Edit Flat' : 'Add Flat'}</h2>
      <form onSubmit={handleSubmit} className='fstyle'>

        <div className='fInputDiv'>
          <label className='flaStyle'>Flat Number</label>
          <input
            type="text"
            name="flatNumber"
            value={formData.flatNumber}
            onChange={handleInputChange}
          />
          {errors.flatNumber && <span className='fspans'>{errors.flatNumber}</span>}
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Block/Tower Number</label>
          <input
            type="text"
            name="blockNumber"
            value={formData.blockNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
          />
          {errors.ownerName && <span className='fspans'>{errors.ownerName}</span>}
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Owner Contact</label>
          <input
            type="text"
            name="ownerContact"
            value={formData.ownerContact}
            onChange={handleInputChange}
          />
          {errors.ownerContact && <span className='fspans'>{errors.ownerContact}</span>}
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Number of Residents</label>
          <input
            type="number"
            name="residents"
            value={formData.residents}
            onChange={handleInputChange}
          />
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Flat Type</label>
          <select name="flatType" value={formData.flatType} onChange={handleInputChange}>
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
            <option value="4BHK">4BHK</option>
          </select>
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Status</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
          </select>
          {errors.status && <span className='fspans'>{errors.status}</span>}
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Rent/Ownership Information</label>
          <input
            type="text"
            name="rentType"
            value={formData.rentType}
            onChange={handleInputChange}
          />
          {errors.rentType && <span className='fspans'>{errors.rentType}</span>}
        </div>

        <div className='fInputDiv'>
          <label className='flaStyle'>Start Date of Ownership/Rental</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>

        <button className='btn-s' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FlatForm;