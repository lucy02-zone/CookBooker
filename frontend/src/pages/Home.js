import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const specialties = [
    { name: "Recipe Search", path: "/recipe-search" },
    { name: "Pantry-based Recipes", path: "/pantry-recipes" },
    { name: "Dietary Plans", path: "/diet-plans" },
    { name: "Meal Plans", path: "/meal-plans" },
    { name: "Shopping List", path: "/shopping-list" },
    { name: "Recipe Collections", path: "/recipe-collections" },
  ];

  return (
    <div className="home">
      <header className="hero">
        <h1>CookBooker 🍳</h1>
        <p>Your smart meal planner and recipe finder.</p>
        <button onClick={() => setShowOptions(true)}>Get Started</button>
      </header>

      {showOptions && (
        <section className="options">
          <h2>Choose a Feature</h2>
          <div className="grid">
            {specialties.map((s) => (
              <button key={s.name} onClick={() => navigate(s.path)}>
                {s.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
