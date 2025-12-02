import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";

const provider = new GoogleAuthProvider();

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // 🔹 Send token to backend
  async function saveToBackend(idToken) {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
    } catch (err) {
      console.error("backend error", err?.response?.data || err.message);
    }
  }

  // 🔹 Signup
  async function handleSignup(e) {
    e.preventDefault();
    setMsg("Signing up...");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken(true);
      await saveToBackend(token);
      setMsg("✅ Signup successful!");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  }

  // 🔹 Login
  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Logging in...");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken(true);
      await saveToBackend(token);
      setMsg("✅ Login successful!");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  }

  // 🔹 Google Sign-In
  async function handleGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(true);
      await saveToBackend(token);
      setMsg("✅ Google sign-in success!");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="auth-buttons">
          <button onClick={handleLogin} type="button">
            Login
          </button>
          <button onClick={handleSignup} type="button">
            Signup
          </button>
        </div>
      </form>

      <button className="google-btn" onClick={handleGoogle}>
        Sign in with Google
      </button>

      <p className="auth-message">{msg}</p>
    </div>
  );
}
