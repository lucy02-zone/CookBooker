// backend/routes/mealPlans.js
const express = require("express");
const router = express.Router();
const mongoose = require("../config/db");
const fs = require("fs");
const path = require("path");

// Helper function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Define MealPlan schema
const mealPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true }, // e.g., "Weight Loss", "Muscle Gain", "Balanced"
  meals: [{
    day: { type: String, required: true }, // e.g., "Monday"
    breakfast: { type: String },
    lunch: { type: String },
    dinner: { type: String },
    snacks: [{ type: String }]
  }],
  createdAt: { type: Date, default: Date.now }
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

// GET /api/meal-plans — Fetch all meal plans from MongoDB
router.get("/", async (req, res) => {
  try {
    const mealPlans = await MealPlan.find();
    res.json(mealPlans);
  } catch (error) {
    console.error("DB query error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/meal-plans/:requirements — Fetch meal plans based on requirements
router.get("/:requirements", async (req, res) => {
  try {
    const { requirements } = req.params;
    const mealPlans = await MealPlan.find({ requirements: { $regex: requirements, $options: 'i' } });
    res.json(mealPlans);
  } catch (error) {
    console.error("DB query error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/meal-plans — Add a new meal plan
router.post("/", async (req, res) => {
  try {
    const { name, description, requirements, meals } = req.body;
    if (!name || !description || !requirements || !meals) {
      return res.status(400).json({ error: "Name, description, requirements, and meals are required" });
    }

    const newMealPlan = new MealPlan({ name, description, requirements, meals });
    const savedMealPlan = await newMealPlan.save();
    res.json({ message: "Meal plan added successfully", id: savedMealPlan._id });
  } catch (error) {
    console.error("DB insert error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/meal-plans/generate — Generate a randomized meal plan from recipes JSON based on requirements
router.post("/generate", (req, res) => {
  try {
    const { requirements } = req.body;
    if (!requirements) {
      return res.status(400).json({ error: "Requirements are required" });
    }

    // Read recipes from JSON file
    const recipesPath = path.join(__dirname, '../data/recipes.json');
    const recipesData = fs.readFileSync(recipesPath, 'utf8');
    const allRecipes = JSON.parse(recipesData);

    // Filter recipes by requirements
    const matchingRecipes = allRecipes.filter(recipe =>
      recipe.requirements.toLowerCase().includes(requirements.toLowerCase())
    );

    if (matchingRecipes.length === 0) {
      return res.status(404).json({ error: "No recipes found for the given requirements" });
    }

    // Group recipes by type
    const breakfastRecipes = matchingRecipes.filter(r => r.type === 'breakfast');
    const lunchRecipes = matchingRecipes.filter(r => r.type === 'lunch');
    const dinnerRecipes = matchingRecipes.filter(r => r.type === 'dinner');

    // Shuffle each group
    const shuffledBreakfast = shuffleArray([...breakfastRecipes]);
    const shuffledLunch = shuffleArray([...lunchRecipes]);
    const shuffledDinner = shuffleArray([...dinnerRecipes]);

    // Days of the week
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Generate meals for each day
    const meals = days.map((day, index) => ({
      day,
      breakfast: shuffledBreakfast[index % shuffledBreakfast.length]?.name || 'N/A',
      lunch: shuffledLunch[index % shuffledLunch.length]?.name || 'N/A',
      dinner: shuffledDinner[index % shuffledDinner.length]?.name || 'N/A',
      snacks: ['Apple', 'Greek yogurt'] // Static snacks for now
    }));

    // Create the meal plan object
    const generatedPlan = {
      name: `${requirements} Meal Plan`,
      description: `A randomized ${requirements.toLowerCase()} meal plan.`,
      requirements,
      meals
    };

    res.json(generatedPlan);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
});

module.exports = router;
