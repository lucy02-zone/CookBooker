// src/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const recipeRoutes = require("./routes/recipes");


// Health check
app.get("/", (req, res) => {
  res.send("CookBooker API running...");
});

// Mount routes BEFORE app.listen
app.use("/api/recipes", recipeRoutes);





// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

