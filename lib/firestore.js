// firestore.js
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { app } from "./firebase"; // Import the initialized app

// Initialize Firestore with the app
const db = getFirestore(app);

// Debug function to log detailed errors
const logError = (functionName, error) => {
  console.error(`Error in ${functionName}:`, {
    message: error.message,
    code: error.code,
    stack: error.stack
  });
};

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
    logError('createUserDocument', error);
    throw new Error(`Failed to create user document: ${error.message}`);
  }
};

// Function to add shop
export const addShop = async (shopData, userId) => {
  try {
    if (!userId) {
      console.error("Missing userId when adding shop:", { shopData });
      throw new Error("User ID is required to add a shop");
    }
    
    console.log("Adding shop with data:", { shopData, userId });
    
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
    logError('addShop', e);
    throw e;
  }
};

// Function to get user's shops
export const getUserShops = async (userId) => {
  try {
    if (!userId) {
      console.error("Missing userId when fetching shops");
      throw new Error("User ID is required to fetch shops");
    }
    
    console.log("Fetching shops for userId:", userId);
    
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
    
    console.log(`Found ${shops.length} shops for user ${userId}:`, shops);
    return shops;
  } catch (e) {
    logError('getUserShops', e);
    throw e;
  }
};

// Function to get a single shop
export const getShop = async (shopId) => {
  try {
    if (!shopId) {
      console.error("Missing shopId when fetching shop");
      throw new Error("Shop ID is required");
    }
    
    console.log("Fetching shop with ID:", shopId);
    
    const shopRef = doc(db, "shops", shopId);
    const shopSnap = await getDoc(shopRef);
    
    if (shopSnap.exists()) {
      const shopData = { id: shopSnap.id, ...shopSnap.data() };
      console.log("Retrieved shop:", shopData);
      return shopData;
    } else {
      console.log("No shop found with ID:", shopId);
      return null;
    }
  } catch (e) {
    logError('getShop', e);
    throw e;
  }
};

// Function to add product
export const addProduct = async (productData, shopId, userId) => {
  try {
    if (!shopId || !userId) {
      console.error("Missing required IDs when adding product:", { productData, shopId, userId });
      throw new Error("Shop ID and User ID are required to add a product");
    }
    
    console.log("Adding product with data:", { productData, shopId, userId });
    
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
    logError('addProduct', e);
    throw e;
  }
};

// Function to get shop's products
export const getShopProducts = async (shopId) => {
  try {
    if (!shopId) {
      console.error("Missing shopId when fetching products");
      throw new Error("Shop ID is required to fetch products");
    }
    
    console.log("Fetching products for shopId:", shopId);
    
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
    
    console.log(`Found ${products.length} products for shop ${shopId}:`, products);
    return products;
  } catch (e) {
    logError('getShopProducts', e);
    throw e;
  }
};

// Function to get a single product
export const getProduct = async (productId) => {
  try {
    if (!productId) {
      console.error("Missing productId when fetching product");
      throw new Error("Product ID is required");
    }
    
    console.log("Fetching product with ID:", productId);
    
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const productData = { id: productSnap.id, ...productSnap.data() };
      console.log("Retrieved product:", productData);
      return productData;
    } else {
      console.log("No product found with ID:", productId);
      return null;
    }
  } catch (e) {
    logError('getProduct', e);
    throw e;
  }
};

// Function to add sale
export const addSale = async (saleData, productId, shopId, userId) => {
  try {
    if (!productId || !shopId || !userId) {
      console.error("Missing required IDs when adding sale:", { saleData, productId, shopId, userId });
      throw new Error("Product ID, Shop ID and User ID are required to add a sale");
    }
    
    console.log("Adding sale with data:", { saleData, productId, shopId, userId });
    
    // Get product details for price validation
    const product = await getProduct(productId);
    if (!product) {
      throw new Error(`Product not found with ID: ${productId}`);
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
    logError('addSale', e);
    throw e;
  }
};

// Function to get product's sales
export const getProductSales = async (productId) => {
  try {
    if (!productId) {
      console.error("Missing productId when fetching sales");
      throw new Error("Product ID is required to fetch sales");
    }
    
    console.log("Fetching sales for productId:", productId);
    
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
    
    console.log(`Found ${sales.length} sales for product ${productId}`);
    return sales;
  } catch (e) {
    logError('getProductSales', e);
    throw e;
  }
};

// Function to get shop's sales
export const getShopSales = async (shopId) => {
  try {
    if (!shopId) {
      console.error("Missing shopId when fetching sales");
      throw new Error("Shop ID is required to fetch sales");
    }
    
    console.log("Fetching sales for shopId:", shopId);
    
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
    
    console.log(`Found ${sales.length} sales for shop ${shopId}`);
    return sales;
  } catch (e) {
    logError('getShopSales', e);
    throw e;
  }
};

export { db };