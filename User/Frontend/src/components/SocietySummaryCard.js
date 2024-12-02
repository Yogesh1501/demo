import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./SocietySummaryCard.css"

const SocietySummaryCard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/society_summary');
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching society summary', error);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) {
    return <p>Loading...</p>;
  }

  return (
    <div className="summaryCard">
      <h3>Society Summary</h3>
      <p>Total Flats: {summary.total_flats}</p>
      <p>Maintenance per Flat: ${summary.maintenance_per_flat}</p>
    </div>
  );
};

export default SocietySummaryCard;
