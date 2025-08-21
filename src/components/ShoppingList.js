import React, { useState } from "react";
import "./shoppingList.css";
import HomeButton from "./HomeButton"; // ✅ Reuse Home Button

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input.trim() === "") return;
    setItems([...items, { text: input, bought: false }]);
    setInput("");
  };

  const toggleBought = (index) => {
    const updated = [...items];
    updated[index].bought = !updated[index].bought;
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  return (
    <div className="shopping-container">
      <HomeButton />

      <header className="shopping-header">
        <h1 className="shopping-title">🛒 Shopping List</h1>
        <p className="shopping-subtitle">
          Add ingredients you need for your meals
        </p>
      </header>

      <div className="shopping-input">
        <input
          type="text"
          placeholder="Enter item..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addItem}>Add</button>
      </div>

      <ul className="shopping-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={`shopping-item ${item.bought ? "bought" : ""}`}
          >
            <span onClick={() => toggleBought(index)}>{item.text}</span>
            <button onClick={() => removeItem(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
