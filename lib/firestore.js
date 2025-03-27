// firestore.js
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase"; // Import the initialized app

// Initialize Firestore with the app
const db = getFirestore(app);

// In firestore.js
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user || typeof user !== 'object' || !user.uid) {
    console.error("Invalid user object:", user);
    throw new Error("Invalid user object");
    
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      // Safely handle potentially undefined properties
      const userData = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: new Date(),
        ...additionalData
      };

      // Validate email format if needed
      if (userData.email && typeof userData.email === "string") {
        userData.emailDomain = userData.email.split("@").pop() || "";
      }

      await setDoc(userRef, userData);
      console.log("User document created for:", user.uid);
    } else {
      console.log("User document already exists:", user.uid);
      // Update existing document if needed
      await updateDoc(userRef, {
        lastLogin: new Date(),
        ...additionalData
      });
    }
  } catch (error) {
    console.error("Error in createUserDocument:", error);
    throw new Error("Failed to create user document");
  }
};

// Function to add shop
export const addShop = async (shopData) => {
  try {
    const docRef = await addDoc(collection(db, "shops"), shopData);
    console.log("Shop added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding shop: ", e);
  }
};

// Function to add product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    console.log("Product added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding product: ", e);
  }
};

// Function to add sale
export const addSale = async (saleData) => {
  try {
    const docRef = await addDoc(collection(db, "sales"), saleData);
    console.log("Sale added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding sale: ", e);
  }
};

export { db };