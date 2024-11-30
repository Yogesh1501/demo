import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './NoticeDetail.css'; // Assuming CSS styling is in NoticeDetail.css

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // Fetch specific notice by ID
    axios.get(`http://127.0.0.1:5000/notice/${id}`)
      .then(response => setNotice(response.data))
      .catch(error => console.error("There was an error fetching the notice:", error));
  }, [id]);

  if (!notice) return <p>Loading notice details...</p>;

  return (
    <div className="notice-detail-container">
      <h2>{notice.nname}</h2>
      <p><strong>Type:</strong> {notice.ntype}</p>
      <p><strong>Date:</strong> {notice.ndate}</p>
      <p><strong>Message:</strong> {notice.nmsg}</p>
      <Link to="/notices">
        <button className="back-button">Back to Notices</button>
      </Link>
    </div>
  );
};

export default NoticeDetail;
