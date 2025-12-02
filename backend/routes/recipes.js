// backend/routes/recipes.js
const express = require("express");
const router = express.Router();
const mongoose = require("../config/db");
const fs = require("fs");
const path = require("path");

// Define Recipe schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  category: { type: String },
  goal: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// GET /api/recipes — Fetch all recipes from MongoDB, with optional search by name or ingredients
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        title: { $regex: search, $options: 'i' }
      };
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    console.error("DB query error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/recipes — Add a new recipe
router.post("/", async (req, res) => {
  try {
    const { title, name, ingredients, instructions, category, goal } = req.body;
    if (!title && !name || !ingredients || !instructions) {
      return res.status(400).json({ error: "Title or name, ingredients, and instructions are required" });
    }

    const newRecipe = new Recipe({ title: title || name, ingredients, instructions, category, goal });
    const savedRecipe = await newRecipe.save();
    res.json({ message: "Recipe added successfully", id: savedRecipe._id });
  } catch (error) {
    console.error("DB insert error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/recipes/:id — Fetch a single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error("DB query error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/recipes/name/:name — Fetch a single recipe by name from JSON
router.get("/name/:name", (req, res) => {
  try {
    const { name } = req.params;
    const recipesPath = path.join(__dirname, '../data/recipes.json');
    const recipesData = fs.readFileSync(recipesPath, 'utf8');
    const recipes = JSON.parse(recipesData);

    const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/recipes/pantry — Find recipes that can be made with the given ingredients
router.get("/pantry", (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients are required" });
    }

    const userIngredients = ingredients.split(',').map(ing => ing.trim().toLowerCase());
    const recipesPath = path.join(__dirname, '../data/recipes.json');
    const recipesData = fs.readFileSync(recipesPath, 'utf8');
    const allRecipes = JSON.parse(recipesData);

    // Function to extract ingredient names from recipe ingredients
    const extractIngredientNames = (recipeIngredients) => {
      return recipeIngredients.map(ing => {
        // Take the last word as the ingredient name (e.g., "1 cup oats" -> "oats")
        const words = ing.toLowerCase().split(' ');
        return words[words.length - 1].replace(/[^a-z]/g, ''); // Remove non-letters
      });
    };

    // Filter recipes where at least one required ingredient is available
    const matchingRecipes = allRecipes.filter(recipe => {
      const recipeIngredientNames = extractIngredientNames(recipe.ingredients);
      // Check if at least one recipe ingredient is in the user's ingredients
      return recipeIngredientNames.some(recipeIng =>
        userIngredients.some(userIng => userIng.includes(recipeIng) || recipeIng.includes(userIng))
      );
    });

    // Sort by how many ingredients match (most matches first)
    const sortedRecipes = matchingRecipes.sort((a, b) => {
      const aIngredientNames = extractIngredientNames(a.ingredients);
      const bIngredientNames = extractIngredientNames(b.ingredients);

      const aMatches = aIngredientNames.filter(ing =>
        userIngredients.some(userIng => userIng.includes(ing) || ing.includes(userIng))
      ).length;

      const bMatches = bIngredientNames.filter(ing =>
        userIngredients.some(userIng => userIng.includes(ing) || ing.includes(userIng))
      ).length;

      return bMatches - aMatches;
    });

    // Transform to match the database schema format
    const transformedRecipes = sortedRecipes.slice(0, 20).map(recipe => ({
      _id: recipe.name.replace(/\s+/g, '-').toLowerCase(),
      title: recipe.name,
      ingredients: recipe.ingredients.join(', '),
      instructions: recipe.instructions,
      category: recipe.type,
      goal: recipe.requirements
    }));

    res.json(transformedRecipes);
  } catch (error) {
    console.error("Pantry search error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
