// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const usersRoute = require("./routes/users");

dotenv.config();

const app = express();

// CORS setup (allow all origins for development)
app.use(cors());

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🍳 CookBooker Backend is Running!");
});

// User routes
app.use("/api/users", usersRoute);

// Dietary plans routes
const dietaryPlansRoute = require("./routes/dietaryPlans");
app.use("/api/dietary-plans", dietaryPlansRoute);

// Meal plans routes
const mealPlansRoute = require("./routes/mealPlans");
app.use("/api/meal-plans", mealPlansRoute);

// Recipes routes
const recipesRoute = require("./routes/recipes");
app.use("/api/recipes", recipesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
