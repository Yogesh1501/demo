import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Card/Card";

const Cards = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/cards");
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards data", error);
      }
    };
    fetchCards();
  }, []);

  return (
    <div className="Cards">
      {cards.map((card) => (
        <div className="parentContainer" key={card.id}>
          <Card
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            png={card.png}
            series={card.series}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
