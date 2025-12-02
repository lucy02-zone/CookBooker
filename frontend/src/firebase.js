import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAovlN_7EMZuRa8hA1XbUBQJ_FG-UT8FFg",
  authDomain: "cookbooker-57e3e.firebaseapp.com",
  projectId: "cookbooker-57e3e",
  storageBucket: "cookbooker-57e3e.firebasestorage.app",
  messagingSenderId: "498999217509",
  appId: "1:498999217509:web:0f94d121a4fa81668ae58c",
  measurementId: "G-5CQ83KLRET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
