import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import RecipeSearch from "./components/RecipeSearch";
import IngredientSuggestions from "./components/IngredientSuggestions";
import MealPlanner from "./components/MealPlanner";
import HealthGoals from "./components/HealthGoals";
import ShoppingList from "./components/ShoppingList";
import AddRecipe from "./components/AddRecipe";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipeSearch />} />
        <Route path="/ingredients" element={<IngredientSuggestions />} />
        <Route path="/planner" element={<MealPlanner />} />
        <Route path="/goals" element={<HealthGoals />} />
        <Route path="/shopping" element={<ShoppingList />} />
        <Route path="/add" element={<AddRecipe />} />
      </Routes>
    </Router>
  );
}
