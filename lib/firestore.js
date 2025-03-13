
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebase"; // Import the initialized app

// Initialize Firestore with the app
const db = getFirestore(app);

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


// New function to add a user to Firestore
export const addUser = async (userData) => {
  try {
    const userRef = doc(db, "users", userData.id);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: userData.emailAddresses[0].emailAddress,
        displayName: userData.firstName || "New User",
        createdAt: serverTimestamp(),
      });
      console.log("User saved to Firestore:", userData.id);
    } else {
      console.log("User already exists in Firestore.");
    }
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
  }
};

export { db };