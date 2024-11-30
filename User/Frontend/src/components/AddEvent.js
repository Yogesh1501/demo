import React, { useState } from 'react';
import axios from 'axios';
import './AddEvent.css'; // Assuming the CSS is stored here

const AddEvent = () => {
  const [formData, setFormData] = useState({
    ename: '',
    etype: '',
    edate: '',
    emsg: '',
    eimage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, eimage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('ename', formData.ename);
    form.append('etype', formData.etype);
    form.append('edate', formData.edate);
    form.append('emsg', formData.emsg);
    form.append('eimage', formData.eimage);

    try {
      const response = await axios.post('http://127.0.0.1:5000/addevent', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('Event Created...!!');
        // Optionally reset the form
      } else {
        alert('Failed to create event');
      }
    } catch (error) {
      alert('Error occurred while adding event');
    }
  };

  return (
    <div className="ad-event-container">
      <div className="ad-event-contact-bx">
        <div className="ad-event-r8">
          <h2 className="ad-event-h2">Create Event</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              className="ad-event-field"
              name="ename"
              placeholder="Event Name"
              value={formData.ename}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="ad-event-field"
              name="etype"
              placeholder="Event Type (Party, Meeting, Workshop, etc.)"
              value={formData.etype}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              className="ad-event-field"
              name="edate"
              value={formData.edate}
              onChange={handleChange}
              required
            />
            <textarea
              name="emsg"
              className="ad-event-field"
              placeholder="Enter Event Description"
              value={formData.emsg}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              className="ad-event-field"
              name="eimage"
              onChange={handleFileChange}
              required
            />
            <button className="ad-event-btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
