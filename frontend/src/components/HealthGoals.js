import React, { useState, useEffect } from "react";
import "./healthGoals.css";
import HomeButton from "./HomeButton";

export default function HealthGoals() {
  const [goal, setGoal] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [allGoals, setAllGoals] = useState([]);

  const fetchGoals = async () => {
    const res = await fetch("http://localhost:4000/api/healthgoals");
    const data = await res.json();
    setAllGoals(data);
  };

  const handleSetGoal = async () => {
    let data = [];
    if (goal.toLowerCase().includes("weight")) {
      data = ["Eat high-protein meals 🍗", "Avoid processed sugar ❌", "Include 30 min cardio daily 🏃‍♂️"];
    } else if (goal.toLowerCase().includes("muscle")) {
      data = ["Increase protein intake 💪", "Strength training 4-5 times/week 🏋️", "Stay hydrated 💧"];
    } else if (goal.toLowerCase().includes("balance")) {
      data = ["Include fruits and vegetables 🥦", "Maintain portion control 🍽️", "Stay active daily 🚶"];
    } else {
      data = ["Please enter a goal like 'weight loss', 'muscle gain', or 'balanced diet'."];
    }

    // save to backend
    await fetch("http://localhost:4000/api/healthgoals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, recommendations: data }),
    });

    setGoal("");
    fetchGoals();
  };

  useEffect(() => {
    fetchGoals();
  }, []);

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
        {allGoals.length > 0 ? (
          allGoals.map((g) => (
            <div key={g.id} className="goal-card">
              <h3>{g.goal}</h3>
              <ul>
                {JSON.parse(g.recommendations).map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="placeholder">No goals yet. Enter one above 👆</p>
        )}
      </div>
    </div>
  );
}


