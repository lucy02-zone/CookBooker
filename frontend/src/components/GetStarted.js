import React from "react";
import { useNavigate } from "react-router-dom";

const specialties = [
  { name: "Recipe Search", path: "/recipe-search" },
  { name: "Pantry-based Recipes", path: "/pantry-recipes" },
  { name: "Dietary Plans (Keto/Vegan)", path: "/dietary-plans" },
  { name: "Meal Plans (Weight loss/Gain)", path: "/meal-plans" },
  { name: "Shopping Lists", path: "/shopping-lists" },
  { name: "Recipe Collections", path: "/recipe-collections" },
];

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <section className="get-started">
      <h3>Choose a feature</h3>
      <div className="feature-grid">
        {specialties.map((s) => (
          <button
            key={s.name}
            onClick={() => navigate(s.path)}
            className="feature-btn"
          >
            {s.name}
          </button>
        ))}
      </div>
    </section>
  );
}
