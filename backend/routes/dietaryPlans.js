// backend/routes/dietaryPlans.js
const express = require("express");
const router = express.Router();
const mongoose = require("../config/db");

// Define DietaryPlan schema
const dietaryPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  guidelines: [{ type: String }],
  mealSuggestions: {
    breakfast: [{ type: String }],
    lunch: [{ type: String }],
    dinner: [{ type: String }]
  },
  restrictions: [{ type: String }],
  benefits: [{ type: String }],
  duration: { type: String },
  difficulty: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const DietaryPlan = mongoose.model('DietaryPlan', dietaryPlanSchema);

module.exports.DietaryPlan = DietaryPlan;

// GET /api/dietary-plans — Fetch all dietary plans from MongoDB
router.get("/", async (req, res) => {
  try {
    const dietaryPlans = await DietaryPlan.find();
    res.json(dietaryPlans);
  } catch (error) {
    console.error("DB query error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/dietary-plans/:id — Fetch a specific dietary plan
router.get("/:id", async (req, res) => {
  try {
    const dietaryPlan = await DietaryPlan.findById(req.params.id);
    if (!dietaryPlan) {
      return res.status(404).json({ error: "Dietary plan not found" });
    }
    res.json(dietaryPlan);
  } catch (error) {
    console.error("DB query error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/dietary-plans — Add a new dietary plan (optional, for completeness)
router.post("/", async (req, res) => {
  try {
    const { name, description, guidelines, mealSuggestions, restrictions, benefits, duration, difficulty } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const newDietaryPlan = new DietaryPlan({ name, description, guidelines, mealSuggestions, restrictions, benefits, duration, difficulty });
    const savedDietaryPlan = await newDietaryPlan.save();
    res.json({ message: "Dietary plan added successfully", id: savedDietaryPlan._id });
  } catch (error) {
    console.error("DB insert error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
