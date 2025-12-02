const express = require("express");
const router = express.Router();
const db = require("../config/db");


// Get all recipes
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recipes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new recipe
router.post("/", async (req, res) => {
  try {
    const { title, category, ingredients, instructions } = req.body;
    const [result] = await db.query(
      "INSERT INTO recipes (title, category, ingredients, instructions) VALUES (?, ?, ?, ?)",
      [title, category, JSON.stringify(ingredients), instructions]
    );

    res.json({
      id: result.insertId,
      title,
      category,
      ingredients,
      instructions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
