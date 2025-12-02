const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const recipeRoutes = require("./routes/recipes");
const ingredientRoutes = require("./routes/ingredientRoutes");

// Health check
app.get("/", (req, res) => {
  res.send("CookBooker API running...");
});

// Mount routes BEFORE app.listen
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
