// backend/routes/users.js
const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseAdmin");
const mongoose = require("../config/db");

// Define User schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  provider: { type: String, default: "unknown" },
  shoppingList: { type: Array, default: [] },
  favoriteRecipes: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// POST /api/users — verify Firebase ID token and save user
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name, firebase: { sign_in_provider } = {} } = decoded;

    // Fallback display name & provider
    const displayName = decoded.name || null;
    const provider = sign_in_provider || "unknown";

    // Insert or update user in MongoDB
    const user = await User.findOneAndUpdate(
      { uid },
      { email, displayName, provider },
      { upsert: true, new: true }
    );

    res.json({ message: "User verified and saved successfully", uid: user.uid, email: user.email });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// GET /api/users/shopping-list — get user's shopping list
router.get("/shopping-list", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ shoppingList: user.shoppingList || [] });
  } catch (err) {
    console.error("Error fetching shopping list:", err.message);
    res.status(500).json({ error: "Failed to fetch shopping list" });
  }
});

// PUT /api/users/shopping-list — update user's shopping list
router.put("/shopping-list", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { shoppingList } = req.body;
    if (!Array.isArray(shoppingList)) {
      return res.status(400).json({ error: "shoppingList must be an array" });
    }

    const user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      { shoppingList },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Shopping list updated successfully", shoppingList: user.shoppingList });
  } catch (err) {
    console.error("Error updating shopping list:", err.message);
    res.status(500).json({ error: "Failed to update shopping list" });
  }
});

// GET /api/users/favorite-recipes — get user's favorite recipes
router.get("/favorite-recipes", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ favoriteRecipes: user.favoriteRecipes || [] });
  } catch (err) {
    console.error("Error fetching favorite recipes:", err.message);
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
});

// PUT /api/users/favorite-recipes — update user's favorite recipes
router.put("/favorite-recipes", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { favoriteRecipes } = req.body;
    if (!Array.isArray(favoriteRecipes)) {
      return res.status(400).json({ error: "favoriteRecipes must be an array" });
    }

    const user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      { favoriteRecipes },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Favorite recipes updated successfully", favoriteRecipes: user.favoriteRecipes });
  } catch (err) {
    console.error("Error updating favorite recipes:", err.message);
    res.status(500).json({ error: "Failed to update favorite recipes" });
  }
});

module.exports = router;
