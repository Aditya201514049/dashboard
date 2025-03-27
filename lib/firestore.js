// firestore.js
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "./firebase"; // Import the initialized app

// Initialize Firestore with the app
const db = getFirestore(app);


// Create or update user document
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document:", error);
    }
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