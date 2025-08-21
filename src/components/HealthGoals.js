import React, { useState } from "react";
import "./healthGoals.css";
import HomeButton from "./HomeButton";

export default function HealthGoals() {
  const [goal, setGoal] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleSetGoal = () => {
    // Mock recommendations
    let data = [];
    if (goal.toLowerCase().includes("weight")) {
      data = [
        "Eat high-protein meals 🍗",
        "Avoid processed sugar ❌",
        "Include 30 min cardio daily 🏃‍♂️"
      ];
    } else if (goal.toLowerCase().includes("muscle")) {
      data = [
        "Increase protein intake 💪",
        "Strength training 4-5 times/week 🏋️",
        "Stay hydrated 💧"
      ];
    } else if (goal.toLowerCase().includes("balance")) {
      data = [
        "Include fruits and vegetables 🥦",
        "Maintain portion control 🍽️",
        "Stay active daily 🚶"
      ];
    } else {
      data = ["Please enter a goal like 'weight loss', 'muscle gain', or 'balanced diet'."];
    }
    setRecommendations(data);
  };

  return (
    <div className="goals-container">
      <HomeButton />
      <header className="goals-header">
        <h1 className="goals-title">Health Goals</h1>
        <p className="goals-subtitle">Set your goal and get personalized recommendations ✨</p>
      </header>

      <div className="goals-input">
        <input
          type="text"
          placeholder="Enter your goal (e.g., Weight Loss, Muscle Gain)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button onClick={handleSetGoal}>Set Goal</button>
      </div>

      <div className="goals-results">
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        ) : (
          <p className="placeholder">No recommendations yet. Enter a goal above 👆</p>
        )}
      </div>
    </div>
  );
}

