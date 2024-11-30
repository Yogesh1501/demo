import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticesList.css'; // Assuming CSS styling is in NoticesList.css

const NoticesList = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all notices
    axios.get('http://127.0.0.1:5000/notices')
      .then(response => setNotices(response.data))
      .catch(error => console.error("There was an error fetching the notices:", error));
  }, []);

  const handleRowClick = (id) => {
    // Navigate to NoticeDetail with the selected notice ID
    navigate(`/notice/${id}`);
  };

  return (
    <div className="notices-list-container">
      <h2>All Notices</h2>
      <table className="notices-table">
        <thead>
          <tr>
            <th>Notice Name</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(notice => (
            <tr key={notice.id} onClick={() => handleRowClick(notice.id)}>
              <td>{notice.nname}</td>
              <td>{notice.ntype}</td>
              <td>{notice.ndate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoticesList;
