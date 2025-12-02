import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import axios from "axios";

function RecipeCollections() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(response.data.favoriteRecipes || []);
      } catch (err) {
        setError("Failed to load favorite recipes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, []);

  const removeFavorite = async (recipeId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const updatedFavorites = favorites.filter(fav => fav._id !== recipeId);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/favorite-recipes`,
        { favoriteRecipes: updatedFavorites },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(updatedFavorites);
    } catch (err) {
      setError("Failed to remove favorite");
      console.error(err);
    }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error) return <div className="page"><p>{error}</p></div>;

  return (
    <div className="page">
      <div className="button-group">
        <button className="back-btn" onClick={() => window.history.back()} style={{ marginBottom: '20px' }}>
          ⬅ Back to Home
        </button>
        <button className="home-btn" onClick={() => window.location.href = '/'} style={{ marginBottom: '20px' }}>
          🏠 Home
        </button>
      </div>

      <h2>📚 Recipe Collections</h2>
      <p>Save and view your favorite recipes here!</p>
      {favorites.length === 0 ? (
        <p>No recipes saved yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((recipe) => (
            <div key={recipe._id} className="favorite-item">
              <h3>{recipe.title || recipe.name}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <button onClick={() => removeFavorite(recipe._id)} className="remove-btn">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeCollections;
