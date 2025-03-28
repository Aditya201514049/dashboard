// firestore.js
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
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
export const addShop = async (shopData, userId) => {
  try {
    // Add user ID and timestamps to shop data
    const enrichedShopData = {
      ...shopData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "shops"), enrichedShopData);
    console.log("Shop added with ID: ", docRef.id);
    return docRef.id; // Return the new shop ID
  } catch (e) {
    console.error("Error adding shop: ", e);
    throw e;
  }
};

// Function to get user's shops
export const getUserShops = async (userId) => {
  try {
    const q = query(
      collection(db, "shops"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const shops = [];
    
    querySnapshot.forEach((doc) => {
      shops.push({ id: doc.id, ...doc.data() });
    });
    
    return shops;
  } catch (e) {
    console.error("Error getting user shops: ", e);
    throw e;
  }
};

// Function to get a single shop
export const getShop = async (shopId) => {
  try {
    const shopRef = doc(db, "shops", shopId);
    const shopSnap = await getDoc(shopRef);
    
    if (shopSnap.exists()) {
      return { id: shopSnap.id, ...shopSnap.data() };
    } else {
      console.log("No such shop!");
      return null;
    }
  } catch (e) {
    console.error("Error getting shop: ", e);
    throw e;
  }
};

// Function to add product
export const addProduct = async (productData, shopId, userId) => {
  try {
    // Add shop ID, user ID and timestamps to product data
    const enrichedProductData = {
      ...productData,
      shopId,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "products"), enrichedProductData);
    console.log("Product added with ID: ", docRef.id);
    return docRef.id; // Return the new product ID
  } catch (e) {
    console.error("Error adding product: ", e);
    throw e;
  }
};

// Function to get shop's products
export const getShopProducts = async (shopId) => {
  try {
    const q = query(
      collection(db, "products"), 
      where("shopId", "==", shopId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (e) {
    console.error("Error getting shop products: ", e);
    throw e;
  }
};

// Function to get a single product
export const getProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (e) {
    console.error("Error getting product: ", e);
    throw e;
  }
};

// Function to add sale
export const addSale = async (saleData, productId, shopId, userId) => {
  try {
    // Get product details for price validation
    const product = await getProduct(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    
    // Add product ID, shop ID, user ID and timestamps to sale data
    const enrichedSaleData = {
      ...saleData,
      productId,
      shopId,
      userId,
      productName: product.name,
      unitPrice: product.price,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "sales"), enrichedSaleData);
    console.log("Sale added with ID: ", docRef.id);
    
    // Update product stock if needed
    if (product.stock) {
      const newStock = parseInt(product.stock) - parseInt(saleData.quantity);
      await updateDoc(doc(db, "products", productId), {
        stock: Math.max(0, newStock).toString(),
        updatedAt: serverTimestamp()
      });
    }
    
    return docRef.id; // Return the new sale ID
  } catch (e) {
    console.error("Error adding sale: ", e);
    throw e;
  }
};

// Function to get product's sales
export const getProductSales = async (productId) => {
  try {
    const q = query(
      collection(db, "sales"), 
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const sales = [];
    
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    
    return sales;
  } catch (e) {
    console.error("Error getting product sales: ", e);
    throw e;
  }
};

// Function to get shop's sales
export const getShopSales = async (shopId) => {
  try {
    const q = query(
      collection(db, "sales"), 
      where("shopId", "==", shopId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const sales = [];
    
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    
    return sales;
  } catch (e) {
    console.error("Error getting shop sales: ", e);
    throw e;
  }
};

export { db };