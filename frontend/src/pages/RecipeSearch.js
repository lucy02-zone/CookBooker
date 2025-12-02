import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import axios from "axios";

export default function RecipeSearch() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchFavorites();
      } else {
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(response.data.favoriteRecipes || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const fetchRecipes = useCallback(async () => {
    try {
      const url = searchTerm
        ? `http://localhost:5000/api/recipes?search=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:5000/api/recipes';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const recipesData = await response.json();
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const toggleFavorite = async (recipe) => {
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
      let currentFavorites = response.data.favoriteRecipes || [];
      const isFavorite = currentFavorites.some(fav => fav._id === recipe._id);
      if (isFavorite) {
        currentFavorites = currentFavorites.filter(fav => fav._id !== recipe._id);
      } else {
        currentFavorites.push(recipe);
      }
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
        { favoriteRecipes: currentFavorites },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(currentFavorites);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav._id === recipeId);
  };

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

      <h2>🍳 Recipe Search</h2>
      <p>Discover recipes by name.</p>

      <div className="recipe-search-controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="search-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <div key={recipe._id || recipe.name} className="recipe-card-link">
            <div className="recipe-card">
              <div className="recipe-header">
                <h3>{recipe.title || recipe.name}</h3>
                {user && (
                  <button
                    onClick={() => toggleFavorite(recipe)}
                    className={`star-btn ${isFavorite(recipe._id) ? 'favorited' : ''}`}
                  >
                    {isFavorite(recipe._id) ? '⭐' : '☆'}
                  </button>
                )}
              </div>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
              <button
                onClick={() => navigate(`/recipe-detail/${recipe._id}`)}
                className="view-recipe-btn"
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
