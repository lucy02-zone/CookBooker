import React, { useState } from "react";
import axios from "axios";
import "./ingredientSuggestions.css";
import HomeButton from "./HomeButton";

export default function IngredientSuggestions() {
  const [ingredients, setIngredients] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSuggest = async () => {
    if (!ingredients.trim()) return;

    try {
      const res = await axios.post("http://localhost:4000/api/ingredients/suggestions", {
        ingredients: ingredients.split(",").map((i) => i.trim())
      });

      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="ingredient-container">
      <HomeButton />
      <header className="ingredient-header">
        <h1 className="ingredient-title">Ingredient Suggestions</h1>
        <p className="ingredient-subtitle">
          Enter ingredients you have, get recipes instantly
        </p>
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
              <h2>{item.title}</h2>
              <p className="category">{item.category}</p>
              <h4>Ingredients:</h4>
              <ul>
                {item.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <h4>Instructions:</h4>
              <p>{item.instructions}</p>
            </div>
          ))
        ) : (
          <p className="placeholder">
            No suggestions yet. Try entering some ingredients above 👆
          </p>
        )}
      </div>
    </div>
  );
}


