import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import recipesData from "../data/recipes.json";

function PantryRecipes() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function findRecipes() {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Parse user ingredients
      const userIngredients = ingredients.toLowerCase().split(',').map(ing => ing.trim()).filter(ing => ing);

      // Filter recipes based on ingredients
      const matchingRecipes = recipesData.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
        // Check if at least 50% of user ingredients are present in the recipe
        const matchingCount = userIngredients.filter(userIng =>
          recipeIngredients.some(recipeIng => recipeIng.includes(userIng))
        ).length;
        return matchingCount >= Math.ceil(userIngredients.length * 0.5);
      });

      setRecipes(matchingRecipes);
    } catch (err) {
      console.error("Error finding recipes:", err);
      setError("Failed to find recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="button-group">
        <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: '20px' }}>
          ⬅ Back to Home
        </button>
        <button className="home-btn" onClick={() => navigate("/")} style={{ marginBottom: '20px' }}>
          🏠 Home
        </button>
      </div>

      <h2>🥕 Pantry Recipes</h2>
      <p>Enter ingredients you have in your pantry and find recipes you can make with them!</p>

      <div className="pantry-controls">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated, e.g., chicken, rice, onion, tomato)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="pantry-input"
        />
        <button
          onClick={findRecipes}
          disabled={loading}
          className="find-btn"
        >
          {loading ? "Finding..." : "Find Recipes"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="pantry-results">
        {recipes.length > 0 ? (
          <>
            <p className="results-count">Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} you can make!</p>
            {recipes.map((recipe, index) => (
              <div key={index} className="pantry-recipe-card">
                <h3>{recipe.name}</h3>
                <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                <p><strong>Instructions:</strong> {recipe.instructions.substring(0, 150)}...</p>
                <p><strong>Type:</strong> {recipe.type} | <strong>Requirements:</strong> {recipe.requirements}</p>
                <button
                  onClick={() => navigate(`/recipe-detail/${index}`)}
                  className="view-recipe-btn"
                >
                  View Full Recipe
                </button>
              </div>
            ))}
          </>
        ) : (
          !loading && ingredients.trim() && <p>No recipes found with those ingredients. Try adding more ingredients or different ones!</p>
        )}
      </div>


    </div>
  );
}

export default PantryRecipes;
