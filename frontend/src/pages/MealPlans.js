import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MealPlans() {
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (selectedRequirement) {
      fetchMealPlansByRequirement(selectedRequirement);
    } else {
      fetchAllMealPlans();
    }
  }, [selectedRequirement]);

  const fetchAllMealPlans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/meal-plans");
      setMealPlans(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching meal plans:", err);
      setError("Failed to load meal plans. Please try again later.");
      setLoading(false);
    }
  };

  const fetchMealPlansByRequirement = async (requirement) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/meal-plans/${requirement}`);
      setMealPlans(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching meal plans by requirement:", err);
      setError("Failed to load meal plans. Please try again later.");
      setLoading(false);
    }
  };

  const handleRequirementChange = (e) => {
    setSelectedRequirement(e.target.value);
  };

  const generateMealPlan = async () => {
    if (!selectedRequirement) {
      alert("Please select a requirement first.");
      return;
    }
    setGenerating(true);
    try {
      const response = await axios.post("http://localhost:5000/api/meal-plans/generate", {
        requirements: selectedRequirement
      });
      setGeneratedPlan(response.data);
    } catch (err) {
      console.error("Error generating meal plan:", err);
      alert("Failed to generate meal plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>🍱 Meal Plans</h2>
        <p>Loading meal plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2>🍱 Meal Plans</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="button-group">
        <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: '20px' }}>
          ⬅ Back to Home
        </button>
        <button className="home-btn" onClick={() => navigate("/")} style={{ marginBottom: '20px' }}>
          🏠 Home
        </button>
      </div>

      <h2>🍱 Meal Plans</h2>
      <p>Plan meals based on your requirements:</p>

      <div className="meal-plan-controls">
        <select value={selectedRequirement} onChange={handleRequirementChange} className="requirement-select">
          <option value="">All Requirements</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Balanced">Balanced</option>
        </select>
        <button onClick={generateMealPlan} disabled={generating} className="generate-btn">
          {generating ? "Generating..." : "Generate Meal Plan"}
        </button>
      </div>

      {generatedPlan && (
        <div className="generated-plan">
          <h3>Generated Meal Plan</h3>
          <div className="meal-plan-card">
            <h4>{generatedPlan.name}</h4>
            <p><strong>Description:</strong> {generatedPlan.description}</p>
            <p><strong>Requirements:</strong> {generatedPlan.requirements}</p>
            <div className="meals">
              <h5>Meals:</h5>
              {generatedPlan.meals.map((meal, index) => (
                <div key={index} className="meal-day">
                  <h6>{meal.day}</h6>
                  <p><strong>Breakfast:</strong> <span className="recipe-link" onClick={() => navigate(`/recipe?name=${encodeURIComponent(meal.breakfast)}`)}>{meal.breakfast || "N/A"}</span></p>
                  <p><strong>Lunch:</strong> <span className="recipe-link" onClick={() => navigate(`/recipe?name=${encodeURIComponent(meal.lunch)}`)}>{meal.lunch || "N/A"}</span></p>
                  <p><strong>Dinner:</strong> <span className="recipe-link" onClick={() => navigate(`/recipe?name=${encodeURIComponent(meal.dinner)}`)}>{meal.dinner || "N/A"}</span></p>
                  {meal.snacks && meal.snacks.length > 0 && (
                    <p><strong>Snacks:</strong> {meal.snacks.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mealPlans.length === 0 ? (
        <p>No meal plans available for the selected requirement.</p>
      ) : (
        <div className="meal-plans-grid">
          {mealPlans.map((plan) => (
            <div key={plan._id} className="meal-plan-card">
              <h3>{plan.name}</h3>
              <p><strong>Description:</strong> {plan.description}</p>
              <p><strong>Requirements:</strong> {plan.requirements}</p>
              <div className="meals">
                <h4>Meals:</h4>
                {plan.meals.map((meal, index) => (
                  <div key={index} className="meal-day">
                    <h5>{meal.day}</h5>
                    <p><strong>Breakfast:</strong> {meal.breakfast || "N/A"}</p>
                    <p><strong>Lunch:</strong> {meal.lunch || "N/A"}</p>
                    <p><strong>Dinner:</strong> {meal.dinner || "N/A"}</p>
                    {meal.snacks && meal.snacks.length > 0 && (
                      <p><strong>Snacks:</strong> {meal.snacks.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MealPlans;
