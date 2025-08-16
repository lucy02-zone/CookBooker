import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

function Placeholder({ name }) {
  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>{name} Page</h2>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients" element={<Placeholder name="Ingredient Suggestions" />} />
        <Route path="/planner" element={<Placeholder name="Meal Planner" />} />
        <Route path="/goals" element={<Placeholder name="Health Goals" />} />
        <Route path="/shopping" element={<Placeholder name="Shopping List" />} />
        <Route path="/add" element={<Placeholder name="Add Recipe" />} />
        <Route path="/recipes" element={<Placeholder name="Recipe Search" />} />
      </Routes>
    </Router>
  );
}

