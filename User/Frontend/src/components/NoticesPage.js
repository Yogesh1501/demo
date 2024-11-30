import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Noticespage.css'; // Assuming CSS styling is here

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Fetch the latest notice for the detail view by default
  const fetchLatestNotice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/latest-notice');
      setSelectedNotice(response.data);
    } catch (error) {
      console.error("Error fetching the latest notice:", error);
    }
  };

  // Fetch notices for the list with truncated message preview
  const fetchNoticesSummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notices-summary');
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices summary:", error);
    }
  };

  useEffect(() => {
    fetchLatestNotice();
    fetchNoticesSummary();
  }, []);

  const handleNoticeClick = (id) => {
    const clickedNotice = notices.find(notice => notice.id === id);
    setSelectedNotice(clickedNotice);
  };

  return (
    <div className="notices-page-container">
      <div className="notice-detail">
        {selectedNotice ? (
          <>
            <h2>{selectedNotice.nname}</h2>
            <p><strong>Type:</strong> {selectedNotice.ntype}</p>
            <p><strong>Date:</strong> {selectedNotice.ndate}</p>
            <p><strong>Message:</strong> {selectedNotice.nmsg}</p>
          </>
        ) : (
          <p>Loading latest notice...</p>
        )}
      </div>

      <div className="notices-list">
        <h3>All Notices</h3>
        <table className="notices-table">
          <thead>
            <tr>
              <th>Notice Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Message Preview</th>
            </tr>
          </thead>
          <tbody>
            {notices.map(notice => (
              <tr key={notice.id} onClick={() => handleNoticeClick(notice.id)}>
                <td>{notice.nname}</td>
                <td>{notice.ntype}</td>
                <td>{notice.ndate}</td>
                <td>{notice.nmsg_preview}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticesPage;
