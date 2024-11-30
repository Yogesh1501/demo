import React, { useState } from "react";
import axios from "axios";

const AddCardForm = () => {
  const [card, setCard] = useState({
    title: "",
    color: "",
    barValue: 0,
    value: 0,
    png: "",
    series: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCard((prevCard) => ({
      ...prevCard,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/add_card", card);
      alert("Card added successfully");
    } catch (error) {
      console.error("There was an error adding the card!", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} />
      <input type="text" name="color" placeholder="Color" onChange={handleChange} />
      <input type="number" name="barValue" placeholder="Bar Value" onChange={handleChange} />
      <input type="number" name="value" placeholder="Value" onChange={handleChange} />
      <input type="text" name="png" placeholder="Image URL" onChange={handleChange} />
      <button type="submit">Add Card</button>
    </form>
  );
};

export default AddCardForm;
