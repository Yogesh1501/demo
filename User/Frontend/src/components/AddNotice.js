import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AddNotice.css'; // Assuming the CSS is stored here

const AddNotice = () => {
  const [formData, setFormData] = useState({
    nname: '',
    ntype: '',
    ndate: '',
    nmsg: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/addnotice', formData);
      if (response.data.success) {
        alert('Notice Created...!!');
        // Redirect or clear form if needed
      } else {
        alert('Please try again');
      }
    } catch (error) {
      alert('Error occurred while sending the notice');
    }
  };

  return (
    <>
    <div className="ad-notice-container">
      <div className="ad-notice-contact-bx">
        <div className="ad-notice-r8">
          <h2 className='ad-notice-h2'>Create Notice</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="ad-notice-field"
              name="nname"
              placeholder="Notice Name"
              value={formData.nname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="ad-notice-field"
              name="ntype"
              placeholder="Notice Type (Events, Rules, Meeting...)"
              value={formData.ntype}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              className="ad-notice-field"
              name="ndate"
              value={formData.ndate}
              onChange={handleChange}
              required
            />
            <textarea
              name="nmsg"
              className="ad-notice-field"
              placeholder="Enter Your Message"
              value={formData.nmsg}
              onChange={handleChange}
              required
            />
            <button className="ad-notice-btn" type="submit">Send</button>
          </form>
        </div>
      </div>
      
    </div>
    {/* <Link to="/notices">
        <button className='btn-s ' style={{ marginTop: '20px' }}>
          View Notices
        </button>
      </Link> */}
      {/* <Link to="/noticespage">
        <button className='btn-s ' style={{ marginTop: '20px' }}>
         notices
        </button>
      </Link> */}
    </>
  );
};

export default AddNotice;
