// firestore.js
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore";
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
    
    // Using a simpler query that doesn't require a composite index
    const q = query(
      collection(db, "sales"), 
      where("productId", "==", productId)
      // Removed the orderBy to avoid needing a composite index
    );
    
    const querySnapshot = await getDocs(q);
    const sales = [];
    
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort the results in JavaScript instead of Firestore
    sales.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA; // Descending order
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
    
    // Using a simpler query that doesn't require a composite index
    const q = query(
      collection(db, "sales"), 
      where("shopId", "==", shopId)
      // Removed the orderBy to avoid needing a composite index
    );
    
    const querySnapshot = await getDocs(q);
    const sales = [];
    
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort the results in JavaScript instead of Firestore
    sales.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA; // Descending order
    });
    
    console.log(`Found ${sales.length} sales for shop ${shopId}`);
    return sales;
  } catch (e) {
    logError('getShopSales', e);
    throw e;
  }
};

// Function to delete a shop
export const deleteShop = async (shopId, userId) => {
  try {
    if (!shopId || !userId) {
      console.error("Missing required IDs when deleting shop:", { shopId, userId });
      throw new Error("Shop ID and User ID are required to delete a shop");
    }
    
    console.log("Attempting to delete shop:", shopId);
    
    // First verify the shop belongs to this user
    const shopRef = doc(db, "shops", shopId);
    const shopSnap = await getDoc(shopRef);
    
    if (!shopSnap.exists()) {
      throw new Error(`Shop not found with ID: ${shopId}`);
    }
    
    const shopData = shopSnap.data();
    if (shopData.userId !== userId) {
      throw new Error("You don't have permission to delete this shop");
    }
    
    // Get all products for this shop
    const shopProducts = await getShopProducts(shopId);
    
    // For each product, delete all related sales
    for (const product of shopProducts) {
      const productSales = await getProductSales(product.id);
      
      // Delete each sale
      for (const sale of productSales) {
        await deleteDoc(doc(db, "sales", sale.id));
        console.log(`Deleted sale: ${sale.id}`);
      }
      
      // Delete the product
      await deleteDoc(doc(db, "products", product.id));
      console.log(`Deleted product: ${product.id}`);
    }
    
    // Finally delete the shop
    await deleteDoc(shopRef);
    console.log(`Successfully deleted shop: ${shopId} with ${shopProducts.length} products`);
    
    return true;
  } catch (e) {
    logError('deleteShop', e);
    throw e;
  }
};

// Function to delete a product
export const deleteProduct = async (productId, userId) => {
  try {
    if (!productId || !userId) {
      console.error("Missing required IDs when deleting product:", { productId, userId });
      throw new Error("Product ID and User ID are required to delete a product");
    }
    
    console.log("Attempting to delete product:", productId);
    
    // First verify the product belongs to this user
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error(`Product not found with ID: ${productId}`);
    }
    
    const productData = productSnap.data();
    if (productData.userId !== userId) {
      throw new Error("You don't have permission to delete this product");
    }
    
    // Get all sales for this product
    const productSales = await getProductSales(productId);
    
    // Delete each sale
    for (const sale of productSales) {
      await deleteDoc(doc(db, "sales", sale.id));
      console.log(`Deleted sale: ${sale.id}`);
    }
    
    // Delete the product
    await deleteDoc(productRef);
    console.log(`Successfully deleted product: ${productId} with ${productSales.length} sales`);
    
    return true;
  } catch (e) {
    logError('deleteProduct', e);
    throw e;
  }
};

// Function to delete a sale
export const deleteSale = async (saleId, userId) => {
  try {
    if (!saleId || !userId) {
      console.error("Missing required IDs when deleting sale:", { saleId, userId });
      throw new Error("Sale ID and User ID are required to delete a sale");
    }
    
    console.log("Attempting to delete sale:", saleId);
    
    // First verify the sale belongs to this user
    const saleRef = doc(db, "sales", saleId);
    const saleSnap = await getDoc(saleRef);
    
    if (!saleSnap.exists()) {
      throw new Error(`Sale not found with ID: ${saleId}`);
    }
    
    const saleData = saleSnap.data();
    if (saleData.userId !== userId) {
      throw new Error("You don't have permission to delete this sale");
    }
    
    // Get the related product to update stock
    const productRef = doc(db, "products", saleData.productId);
    const productSnap = await getDoc(productRef);
    
    // Delete the sale
    await deleteDoc(saleRef);
    console.log(`Successfully deleted sale: ${saleId}`);
    
    // If product exists and has stock, add the quantity back to stock
    if (productSnap.exists()) {
      const productData = productSnap.data();
      if (productData.stock) {
        const updatedStock = parseInt(productData.stock) + parseInt(saleData.quantity);
        await updateDoc(productRef, {
          stock: updatedStock.toString(),
          updatedAt: serverTimestamp()
        });
        console.log(`Updated product stock: ${productData.name} new stock: ${updatedStock}`);
      }
    }
    
    return true;
  } catch (e) {
    logError('deleteSale', e);
    throw e;
  }
};

export { db };