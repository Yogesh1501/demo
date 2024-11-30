import React from "react";
import "./SocietyNotify.css";
import { SocietyNotifications } from "../../Data/Data"; // Import society notifications data

const SocietyNotify = () => {
  return (
    <>
    <h3>Notifications</h3>
    <div className="Updates">
      {SocietyNotifications.map((update, index) => {
        return (
          <div className="update" key={index}>
            <img src={update.img} alt="profile" />
            <div className="noti">
              <div style={{ marginBottom: '0.5rem' }}>
                <span>{update.name}</span>
                <span> {update.noti}</span>
              </div>
              <span>{update.time}</span>
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
};

export default SocietyNotify;
