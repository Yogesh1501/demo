import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventsPage.css'; // CSS for styling

const EventsPage = () => {
  const [latestEvent, setLatestEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/latest-event');
        setLatestEvent(response.data);
      } catch (error) {
        console.error('Error fetching latest event:', error);
      }
    };

    const fetchEventsSummary = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/events-summary');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events summary:', error);
      }
    };

    fetchLatestEvent();
    fetchEventsSummary();
  }, []);

  return (
    <div className="events-page-container">
      <div className="event-detail">
        {latestEvent ? (
          <>
            <h2>{latestEvent.ename}</h2>
            <p><strong>Type:</strong> {latestEvent.etype}</p>
            <p><strong>Date:</strong> {latestEvent.edate}</p>
            <p><strong>Description:</strong> {latestEvent.emsg}</p>
            <img 
              src={`http://127.0.0.1:5000/uploads/${latestEvent.eimage}`} 
              alt={latestEvent.ename} 
              className="event-image" 
            />
          </>
        ) : (
          <p>Loading latest event...</p>
        )}
      </div>

      <div className="events-list">
        <h3>All Other Events</h3>
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Message Preview</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.ename}</td>
                <td>{event.etype}</td>
                <td>{event.edate}</td>
                <td>{event.emsg_preview}...</td>
                <td>
                  <img 
                    src={`http://127.0.0.1:5000/uploads/${event.eimage}`} 
                    alt={event.ename} 
                    className="event-thumb" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;
