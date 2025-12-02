import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "./App.css";
import GetStarted from "./components/GetStarted";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Feature Pages
import RecipeSearch from "./pages/RecipeSearch";
import PantryRecipes from "./pages/PantryRecipes";
import DietaryPlans from "./pages/DietaryPlans";
import DietaryPlanDetail from "./pages/DietaryPlanDetail";
import MealPlans from "./pages/MealPlans";
import ShoppingLists from "./pages/ShoppingLists";
import RecipeCollections from "./pages/RecipeCollections";
import RecipeDetail from "./pages/RecipeDetail";

function Home() {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="App">
      {/* 🔹 Top Navbar */}
      <nav className="navbar">
        <div className="logo">CookBooker</div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="user-email">Welcome, {user.email}</span>
              <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="nav-btn login-btn">Login</button>
              </Link>
              <Link to="/signup">
                <button className="nav-btn signup-btn">Signup</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <header className="hero">
        <h1>CookBooker</h1>
        <p>Your personal cooking assistant</p>

        {/* 👇 Updated Explore button to navigate to Recipe Search */}
        <button className="explore-btn" onClick={() => navigate("/recipe-search")}>
          Explore
        </button>
      </header>

      {/* 🔹 Main Section */}
      <main>
        <section className="intro">
          <h2>Meal planning made simple</h2>
          <button
            className="get-started-btn"
            onClick={() => setShowGetStarted(true)}
          >
            Get Started
          </button>
        </section>

        {showGetStarted && <GetStarted />}
      </main>

      {/* 🔹 Footer */}
      <footer className="footer">© CookBooker</footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Feature Pages */}
        <Route path="/recipe-search" element={<RecipeSearch />} />
        <Route path="/pantry-recipes" element={<PantryRecipes />} />
        <Route path="/dietary-plans" element={<DietaryPlans />} />
        <Route path="/dietary-plans/:id" element={<DietaryPlanDetail />} />
        <Route path="/meal-plans" element={<MealPlans />} />
        <Route path="/shopping-lists" element={<ShoppingLists />} />
        <Route path="/recipe-collections" element={<RecipeCollections />} />
        <Route path="/recipe-detail/:id" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
