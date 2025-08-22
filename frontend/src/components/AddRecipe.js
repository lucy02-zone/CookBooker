import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addRecipe.css";
import HomeButton from "./HomeButton";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [recipes, setRecipes] = useState([]);

  // ✅ Load recipes from backend when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/recipes");
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  // ✅ Add recipe to backend
  const handleAddRecipe = async () => {
    if (!title || !category || !ingredients || !instructions) {
      alert("Please fill all fields");
      return;
    }

    const newRecipe = {
      title,
      category,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      instructions,
    };

    try {
      await axios.post("http://localhost:4000/api/recipes", newRecipe, {
        headers: { "Content-Type": "application/json" },
      });
      fetchRecipes(); 
      setTitle("");
      setCategory("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      console.error("Error adding recipe", error);
    }
  };

  return (
    <div className="add-recipe-container">
      <HomeButton />
      <header className="add-recipe-header">
        <h1 className="add-recipe-title">Add a New Recipe 🍳</h1>
        <p className="add-recipe-subtitle">
          Fill in the details to save your favorite recipe
        </p>
      </header>

      <div className="add-recipe-form">
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g., Vegan, Keto)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <button onClick={handleAddRecipe}>Add Recipe</button>
      </div>

      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p className="category">{recipe.category}</p>
              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <h4>Instructions:</h4>
              <p>{recipe.instructions}</p>
            </div>
          ))
        ) : (
          <p className="placeholder">No recipes added yet 🍴</p>
        )}
      </div>
    </div>
  );
}

