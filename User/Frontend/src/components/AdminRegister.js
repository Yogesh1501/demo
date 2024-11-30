import React, { useState } from 'react';
import './AdminAuth.css';

const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    mobilenumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // API call to register the admin
    fetch('http://127.0.0.1:5000/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          // Reset form after successful registration
          setAdminData({
            name: '',
            email: '',
            mobilenumber: '',
            password: '',
            confirmPassword: ''
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="auth-container">
      <h2 className='head2'>Admin Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-1">
          <label>Name</label>
          <input
           className='input'
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group-1">
          <label>Mobile Number</label>
          <input
           className='input'
            type="text"
            name="mobilenumber"
            value={adminData.mobilenumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group-1">
          <label>Email</label>
          <input
           className='input'
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group-1">
          <label>Password</label>
          <input
             className='input'
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group-1">
          <label>Confirm Password</label>
          <input
            className='input'
            type="password"
            name="confirmPassword"
            value={adminData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="auth-btn">Register</button>
      </form>
      <p>
        Already have an account? <a href="/admin/login">Login here</a>
      </p>
    </div>
  );
};

export default AdminRegister;
