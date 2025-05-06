// Firebase authentication wrapper
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Your web app's Firebase configuration
// IMPORTANT: Replace these placeholders with your actual Firebase config
// You can get this from the Firebase Console after creating your project
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC54NJe108hvM3oU4LpIXwZMZMcdvHWQJg",
  authDomain: "cyberpunk-gm-screen-2c45e.firebaseapp.com",
  projectId: "cyberpunk-gm-screen-2c45e",
  storageBucket: "cyberpunk-gm-screen-2c45e.firebasestorage.app",
  messagingSenderId: "445395157400",
  appId: "1:445395157400:web:eed1e0407d58f8b4cbebed",
  measurementId: "G-WW3ZNQFQBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
  } else {
    // User is signed out
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
  }
});

// Login function
window.login = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in successfully');
  } catch (error) {
    console.error('Error logging in:', error.message);
    alert('Login failed: ' + error.message);
  }
};

// Logout function
window.logout = async function() {
  try {
    await signOut(auth);
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
};