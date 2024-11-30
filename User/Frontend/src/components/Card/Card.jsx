import React from "react";
import "./Card.css";

const Card = ({ title, color, barValue, value, png, series }) => {
  return (
    <div className="Card" style={{ borderColor: color }}>
      <h2>{title}</h2>
      <img src={png} alt="icon" />
      <p>Bar Value: {barValue}</p>
      <p>Value: {value}</p>
      <p>Series: {JSON.stringify(series)}</p>
    </div>
  );
};

export default Card;
