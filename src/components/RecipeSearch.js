import React, { useState } from "react";
import "./recipeSearch.css";
import HomeButton from "./HomeButton";

export default function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Mock data for now (you can replace with API later)
    setResults([
      { title: "Vegan Pasta", category: "Vegan" },
      { title: "Keto Salad", category: "Keto" },
      { title: "Protein Smoothie", category: "High-Protein" },
      { title: "Avocado Toast", category: "Vegetarian" },
    ]);
  };

  return (
    <div className="recipe-container">
      <HomeButton />
      <header className="recipe-header">
        <h1 className="recipe-title">Recipe Search</h1>
      </header>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by title, ingredient, or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <div className="results-grid">
        {results.length > 0 ? (
          results.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p className="category">{recipe.category}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No recipes found. Try searching!</p>
        )}
      </div>
    </div>
  );
}
