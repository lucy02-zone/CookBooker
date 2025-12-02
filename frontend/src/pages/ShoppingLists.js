import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ShoppingLists() {
  const [item, setItem] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadShoppingList(currentUser);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadShoppingList = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/shopping-list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setList(response.data.shoppingList || []);
    } catch (error) {
      console.error("Error loading shopping list:", error);
      // Fallback to localStorage if backend fails
      const savedList = localStorage.getItem("shoppingList");
      if (savedList) {
        setList(JSON.parse(savedList));
      }
    }
  };

  const saveShoppingList = async (newList) => {
    if (!user) return;

    setSaving(true);
    try {
      const token = await user.getIdToken();
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/shopping-list`,
        { shoppingList: newList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error saving shopping list:", error);
      // Fallback to localStorage
      localStorage.setItem("shoppingList", JSON.stringify(newList));
    } finally {
      setSaving(false);
    }
  };

  // Save to backend whenever list changes
  useEffect(() => {
    if (user && !loading) {
      saveShoppingList(list);
    }
  }, [list, user, loading]);

  function addItem() {
    if (!item.trim()) return;
    const newItem = { name: item.trim(), checked: false };
    setList(prevList => [...prevList, newItem]);
    setItem("");
  }

  function removeItem(index) {
    setList(prevList => prevList.filter((_, i) => i !== index));
  }

  function toggleChecked(index) {
    setList(prevList =>
      prevList.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  }

  function clearList() {
    if (window.confirm("Are you sure you want to clear the entire shopping list?")) {
      setList([]);
    }
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

      <h2>🧾 Shopping List</h2>
      <p>Manage your grocery shopping with ease!</p>

      <div className="shopping-controls">
        <div className="add-item-section">
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Add item..."
            className="item-input"
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem} className="add-btn">Add Item</button>
        </div>

        <div className="action-buttons">
          <button onClick={clearList} className="clear-btn">Clear List</button>
        </div>
      </div>

      <div className="shopping-list">
        {list.length === 0 ? (
          <p className="empty-list">Your shopping list is empty. Add some items!</p>
        ) : (
          <ul className="shopping-items">
            {list.map((item, idx) => (
              <li key={idx} className={`list-item ${item.checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecked(idx)}
                  className="item-checkbox"
                />
                <span className="item-text">{item.name}</span>
                <button onClick={() => removeItem(idx)} className="remove-btn">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShoppingLists;
