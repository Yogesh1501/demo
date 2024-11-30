import React, { useState } from 'react';
import './AdminAuth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({
    loginIdentifier: '', // This will hold either email or mobile number
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/admin/login', {
        loginIdentifier: adminData.loginIdentifier,
        password: adminData.password,
      }, {
        withCredentials: true, // Include credentials to store session cookie
      });

      if (response.status === 200) {
        sessionStorage.setItem('loggedin', true);
        const { role } = response.data;
        sessionStorage.setItem('roles', JSON.stringify({ role }));
        navigate('/maindash'); // Redirect to MainDash
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please try again.');
      } else {
        setError('An error occurred while logging in.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2 className='head2'>Admin Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
      <form onSubmit={handleSubmit}>
        <div className="form-group-1">
          <label className='AdLlabel'>Email or Mobile Number</label>
          <input
            className='input'
            type="text" // Allows both email and phone number input
            name="loginIdentifier"
            value={adminData.loginIdentifier}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group-1">
          <label className='AdLlabel'>Password</label>
          <input
             className='input'
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="auth-btn">Login</button>
      </form>
      <p>Don't have an account? <a href="/admin/register">Register here</a></p>
    </div>
  );
};

export default AdminLogin;
