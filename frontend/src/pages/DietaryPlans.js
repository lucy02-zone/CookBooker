import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dietaryPlansData from "../data/dietaryPlans.json";
import "./DietaryPlans.css";

function DietaryPlans() {
  const [dietaryPlans, setDietaryPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDietaryPlans();
  }, []);

  const fetchDietaryPlans = async () => {
    try {
      // Simulate API call with local JSON data
      setDietaryPlans(dietaryPlansData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dietary plans:", err);
      setError("Failed to load dietary plans. Please try again later.");
      setLoading(false);
    }
  };

  const handlePlanClick = (planId) => {
    navigate(`/dietary-plans/${planId}`);
  };

  if (loading) {
    return (
      <div className="page">
        <h2>🥗 Dietary Plans</h2>
        <p>Loading dietary plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>🥗 Dietary Plans</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="button-group">
        <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: '20px' }}>
          ⬅ Back to Home
        </button>
        <button className="home-btn" onClick={() => navigate("/")} style={{ marginBottom: '20px' }}>
          🏠 Home
        </button>
      </div>

      <h2>🥗 Dietary Plans</h2>
      <p>Select a dietary plan to view detailed guidelines and meal suggestions.</p>
      {dietaryPlans.length === 0 ? (
        <p>No dietary plans available.</p>
      ) : (
        <div className="plans-grid">
          {dietaryPlans.map((plan) => (
            <div
              key={plan._id}
              className="plan-card clickable"
              onClick={() => handlePlanClick(plan._id)}
            >
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="plan-meta">
                <span>Duration: {plan.duration}</span>
                <span>Difficulty: {plan.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DietaryPlans;
