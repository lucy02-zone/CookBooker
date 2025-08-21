import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    { name: "Recipe Search", path: "/recipes" },
    { name: "Ingredient Suggestions", path: "/ingredients" },
    { name: "Meal Planner", path: "/planner" },
    { name: "Health Goals", path: "/goals" },
    { name: "Shopping List", path: "/shopping" },
    { name: "Add Recipe", path: "/add" }
  ];

  return (
    <div className="home-container">
      <header className="header">
        <button className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <h1 className="title">COOKBOOKER</h1>
        <button
          className="nav-btn"
          onClick={() => alert("Login feature coming soon")}
        >
          Login
        </button>
      </header>

      <main className="main-content">
        <div className="grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              onClick={() => navigate(f.path)}
            >
              {f.name}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


