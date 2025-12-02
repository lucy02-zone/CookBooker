const handleSetGoal = async () => {
  if (!goal) return;

  try {
    const res = await fetch("http://localhost:4000/api/healthgoals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal,
        recommendations: ["Custom recommendation 1", "Custom recommendation 2"] 
      }),
    });

    const data = await res.json();
    console.log("Saved goal:", data);

    // Refresh goals after saving
    fetchGoals();
    setGoal(""); // clear input
  } catch (err) {
    console.error("Error saving goal:", err);
  }
};

