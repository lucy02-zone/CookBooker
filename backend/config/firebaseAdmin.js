// backend/config/firebaseAdmin.js
const admin = require("firebase-admin");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Resolve the absolute path to serviceAccountKey.json
const serviceAccountPath = path.resolve(__dirname, "..", "serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

console.log("✅ Firebase Admin initialized");

module.exports = admin;

