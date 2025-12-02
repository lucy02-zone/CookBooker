// HomeButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./homeButton.css";

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <button className="home-btn" onClick={() => navigate("/")}>
      ⬅ Home
    </button>
  );
}
