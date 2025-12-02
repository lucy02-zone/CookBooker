import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dietaryPlansData from "../data/dietaryPlans.json";
import "./DietaryPlanDetail.css";

function DietaryPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDietaryPlanDetail();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDietaryPlanDetail = async () => {
    try {
      // Simulate API call with local JSON data
      const foundPlan = dietaryPlansData.find(p => p._id === id);
      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        setError("Dietary plan not found.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dietary plan detail:", err);
      setError("Failed to load dietary plan details. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading dietary plan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p>{error}</p>
        <button onClick={() => navigate("/dietary-plans")}>Back to Plans</button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="page">
        <p>Dietary plan not found.</p>
        <button onClick={() => navigate("/dietary-plans")}>Back to Plans</button>
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

      <h1>{plan.name}</h1>
      <p className="plan-description">{plan.description}</p>

      <div className="plan-meta">
        <span className="duration">Duration: {plan.duration}</span>
        <span className="difficulty">Difficulty: {plan.difficulty}</span>
      </div>

      <section className="guidelines">
        <h2>📋 Guidelines</h2>
        <ul>
          {plan.guidelines.map((guideline, index) => (
            <li key={index}>{guideline}</li>
          ))}
        </ul>
      </section>

      <section className="meal-suggestions">
        <h2>🍽️ Meal Suggestions</h2>
        <div className="meals">
          <div className="meal-category">
            <h3>Breakfast</h3>
            <ul>
              {plan.mealSuggestions.breakfast.map((meal, index) => (
                <li key={index}>{meal}</li>
              ))}
            </ul>
          </div>
          <div className="meal-category">
            <h3>Lunch</h3>
            <ul>
              {plan.mealSuggestions.lunch.map((meal, index) => (
                <li key={index}>{meal}</li>
              ))}
            </ul>
          </div>
          <div className="meal-category">
            <h3>Dinner</h3>
            <ul>
              {plan.mealSuggestions.dinner.map((meal, index) => (
                <li key={index}>{meal}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="restrictions">
        <h2>🚫 Restrictions</h2>
        <ul>
          {plan.restrictions.map((restriction, index) => (
            <li key={index}>{restriction}</li>
          ))}
        </ul>
      </section>

      <section className="benefits">
        <h2>✅ Benefits</h2>
        <ul>
          {plan.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default DietaryPlanDetail;
