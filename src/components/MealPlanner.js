import React, { useState } from "react";
import "./mealPlanner.css";
import HomeButton from "./HomeButton";

export default function MealPlanner() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [meals, setMeals] = useState({});

  const handleMealChange = (day, mealType, value) => {
    setMeals((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }));
  };

  return (
    <div className="meal-container">
        <HomeButton />
      <header className="meal-header">
        <h1 className="meal-title">Weekly Meal Planner</h1>
        <p className="meal-subtitle">Plan your meals for the week 🍴</p>
      </header>

      <div className="meal-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="meal-card">
            <h2 className="day-title">{day}</h2>
            <div className="meal-inputs">
              <input
                type="text"
                placeholder="Breakfast"
                value={meals[day]?.breakfast || ""}
                onChange={(e) => handleMealChange(day, "breakfast", e.target.value)}
              />
              <input
                type="text"
                placeholder="Lunch"
                value={meals[day]?.lunch || ""}
                onChange={(e) => handleMealChange(day, "lunch", e.target.value)}
              />
              <input
                type="text"
                placeholder="Dinner"
                value={meals[day]?.dinner || ""}
                onChange={(e) => handleMealChange(day, "dinner", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
