import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SocietyEvents.css";

const SocietyEventsComponent = () => {
  const [latestEvents, setLatestEvents] = useState([]);
  const [formatDistanceToNow, setFormatDistanceToNow] = useState(null);

  useEffect(() => {
    const fetchFormatter = async () => {
      const { formatDistanceToNow } = await import("date-fns");
      setFormatDistanceToNow(() => formatDistanceToNow);
    };

    fetchFormatter();

    const fetchLatestThreeEvents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/latest-three-events");
        setLatestEvents(response.data);
      } catch (error) {
        console.error("Error fetching latest three events:", error);
      }
    };

    fetchLatestThreeEvents();
  }, []);

  return (
    <>
      <h3>Latest Events</h3>
      <div className="Updates">
        {latestEvents.map((event, index) => (
          <div className="update" key={index}>
            <div className="noti">
              <span><strong>{event.ename}</strong></span>
              <span> {event.emsg_preview}...</span>
              {formatDistanceToNow && (
                <span className="time-ago">
                  {formatDistanceToNow(new Date(event.edate), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SocietyEventsComponent;
