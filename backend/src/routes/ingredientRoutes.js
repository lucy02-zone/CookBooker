const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Suggest recipes based on ingredients or keywords
router.post("/suggestions", async (req, res) => {
  try {
    let { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "Ingredients/keywords are required" });
    }
    if (typeof ingredients === "string") {
      ingredients = ingredients.split(",").map((i) => i.trim());
    }

    console.log("🔍 Received search terms:", ingredients);

    // Fetch all recipes
    const [rows] = await db.query("SELECT * FROM recipes");

    const suggestions = rows
      .map((recipe) => {
        let recipeIngredients = [];

        // Since it's stored as JSON in MySQL, parse directly
        try {
          recipeIngredients = JSON.parse(recipe.ingredients);
        } catch (e) {
          console.error("⚠️ Failed to parse ingredients JSON:", recipe.ingredients);
          recipeIngredients = [];
        }

        // Flexible matching: ingredients OR title OR category
        const hasMatch = ingredients.some((input) => {
          const search = input.toLowerCase();
          return (
            recipeIngredients.some((ing) => ing.toLowerCase().includes(search)) ||
            recipe.title.toLowerCase().includes(search) ||
            recipe.category.toLowerCase().includes(search)
          );
        });

        if (hasMatch) {
          return {
            id: recipe.id,
            title: recipe.title,
            category: recipe.category,
            ingredients: recipeIngredients,
            instructions: recipe.instructions,
            created_at: recipe.created_at,
          };
        }
        return null;
      })
      .filter((r) => r !== null);

    console.log("✅ Suggestions found:", suggestions);

    res.json(suggestions);
  } catch (err) {
    console.error("❌ Error in suggestions route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
