import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";
import axios from "axios";
import recipesData from "../data/recipes.json";

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchRecipe = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('name');
      if (name) {
        const recipeData = recipesData.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          setError('Recipe not found');
        }
      } else if (isNaN(id)) {
        // If id is not a number, assume it's an _id from API
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
        if (!response.ok) throw new Error('Failed to fetch recipe');
        const recipeData = await response.json();
        setRecipe(recipeData);
      } else {
        // If id is a number, use as index in local recipesData
        const recipeIndex = parseInt(id);
        if (recipeIndex >= 0 && recipeIndex < recipesData.length) {
          setRecipe(recipesData[recipeIndex]);
        } else {
          setError('Recipe not found');
        }
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Recipe not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  useEffect(() => {
    if (user && recipe) {
      checkIfFavorite();
    }
  }, [user, recipe]);

  const checkIfFavorite = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const favorites = response.data.favoriteRecipes || [];
      setIsFavorite(favorites.some(fav => fav._id === recipe._id));
    } catch (err) {
      console.error("Error checking favorite:", err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to save favorites");
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let favorites = response.data.favoriteRecipes || [];
      if (isFavorite) {
        favorites = favorites.filter(fav => fav._id !== recipe._id);
      } else {
        favorites.push(recipe);
      }
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
        { favoriteRecipes: favorites },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (loading) return <div className="page-container"><p>Loading recipe...</p></div>;
  if (error) return <div className="page-container"><p>{error}</p></div>;
  if (!recipe) return <div className="page-container"><p>Recipe not found</p></div>;

  const steps = recipe.instructions.split('.').filter(step => step.trim());

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

      <h2>🍳 {recipe.title || recipe.name}</h2>
      {user && (
        <button onClick={toggleFavorite} className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}>
          {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </button>
      )}

      <div className="recipe-detail">
        <div className="recipe-info">
          <h3>Ingredients</h3>
          <ul>
            {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ing, index) => (
              <li key={index}>{ing}</li>
            )) : <li>{recipe.ingredients}</li>}
          </ul>
          {recipe.prepTime && <p><strong>Prep Time:</strong> {recipe.prepTime}</p>}
          {recipe.cookTime && <p><strong>Cook Time:</strong> {recipe.cookTime}</p>}
          {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
          {recipe.type && <p><strong>Type:</strong> {recipe.type}</p>}
          {recipe.requirements && <p><strong>Requirements:</strong> {recipe.requirements}</p>}
        </div>

        <div className="recipe-steps">
          <h3>Step-by-Step Instructions</h3>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>{step.trim()}</li>
            ))}
          </ol>
        </div>
      </div>


    </div>
  );
}
