// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 
};

// Debug Firebase configuration
console.log("Firebase config:", {
  apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomainExists: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucketExists: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  // Don't log the actual values for security
});

// Initialize Firebase with fallbacks
let app;
let analytics = null;
let auth;

try {
  console.log("Initializing Firebase app with projectId:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");

  // Initialize Analytics (optional)
  analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

  // Initialize Auth
  auth = getAuth(app);
  console.log("Firebase Auth initialized");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Create empty mock objects to prevent app from crashing
  app = {};
  auth = {
    onAuthStateChanged: () => {},
    signOut: async () => {},
    currentUser: null
  };
}

export { app, analytics, auth };
