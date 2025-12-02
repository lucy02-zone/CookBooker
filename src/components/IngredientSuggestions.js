import React, { useState } from "react";
import "./ingredientSuggestions.css";
import HomeButton from "./HomeButton";

export default function IngredientSuggestions() {
  const [ingredients, setIngredients] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSuggest = () => {
    // Mock suggestions for now
    const mockData = [
      { dish: "Veggie Omelette", needed: ["Eggs", "Cheese", "Spinach"] },
      { dish: "Pasta Salad", needed: ["Pasta", "Tomato", "Olive Oil"] },
      { dish: "Fruit Smoothie", needed: ["Banana", "Milk", "Honey"] }
    ];

    setSuggestions(mockData);
  };

  return (
    <div className="ingredient-container">
        <HomeButton />
      <header className="ingredient-header">
        <h1 className="ingredient-title">Ingredient Suggestions</h1>
        <p className="ingredient-subtitle">Enter ingredients you have, get recipes instantly 🍲</p>
      </header>

      <div className="ingredient-input">
        <input
          type="text"
          placeholder="Enter ingredients (e.g., tomato, cheese, bread)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={handleSuggest}>Suggest Recipes</button>
      </div>

      <div className="ingredient-results">
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <div key={index} className="suggestion-card">
              <h2>{item.dish}</h2>
              <p>
                <strong>Needed:</strong> {item.needed.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p className="placeholder">No suggestions yet. Try entering some ingredients above 👆</p>
        )}
      </div>
    </div>
  );
}

