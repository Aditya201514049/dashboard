"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  addShop, 
  addProduct, 
  addSale, 
  getUserShops, 
  getShopProducts, 
  getProduct
} from "@/lib/firestore";

// Icons
import { 
  FiShoppingBag, 
  FiBox, 
  FiDollarSign, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight, 
  FiTrash2,
  FiEdit,
  FiSearch
} from "react-icons/fi";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeStep, setActiveStep] = useState("shops");
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected data
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form data
  const [shopForm, setShopForm] = useState({ name: "", location: "", description: "" });
  const [productForm, setProductForm] = useState({ name: "", price: "", stock: "", description: "" });
  const [saleForm, setSaleForm] = useState({ quantity: "", date: getCurrentDate() });
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  
  // Get current date in YYYY-MM-DD format for the date input
  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  // Debug user auth status
  useEffect(() => {
    console.log("Auth state changed:", { 
      isAuthenticated: !!user, 
      userId: user?.uid,
      authLoading,
    });
    
    if (user) {
      console.log("User authenticated:", {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email
      });
    }
  }, [user, authLoading]);
  
  // Load user shops on component mount
  useEffect(() => {
    async function loadShops() {
      if (user && !authLoading) {
        try {
          console.log("Loading shops for user:", user.uid);
          setLoading(true);
          setError(null); // Clear any previous errors
          
          const userShops = await getUserShops(user.uid);
          console.log("Loaded shops successfully:", userShops);
          setShops(userShops);
          setLoading(false);
        } catch (error) {
          console.error("Error loading shops:", error);
          setError(`Failed to load shops: ${error.message || 'Unknown error'}`);
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        console.log("No authenticated user, cannot load shops");
        setError("You must be signed in to view shops");
        setLoading(false);
      }
    }
    
    loadShops();
  }, [user, authLoading]);
  
  // Load shop products when a shop is selected
  useEffect(() => {
    async function loadProducts() {
      if (selectedShop) {
        try {
          console.log("Loading products for shop:", selectedShop.id);
          setLoading(true);
          setError(null); // Clear any previous errors
          
          const shopProducts = await getShopProducts(selectedShop.id);
          console.log("Loaded products successfully:", shopProducts);
          setProducts(shopProducts);
          setLoading(false);
        } catch (error) {
          console.error("Error loading products:", error);
          setError(`Failed to load products: ${error.message || 'Unknown error'}`);
          setLoading(false);
        }
      }
    }
    
    loadProducts();
  }, [selectedShop]);
  
  // Handle opening a modal
  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };
  
  // Handle closing a modal
  const closeModal = () => {
    setModalOpen(false);
    // Reset form data based on modal type
    if (modalType === "shop") {
      setShopForm({ name: "", location: "", description: "" });
    } else if (modalType === "product") {
      setProductForm({ name: "", price: "", stock: "", description: "" });
    } else if (modalType === "sale") {
      setSaleForm({ quantity: "", date: getCurrentDate() });
    }
  };
  
  // Handle shop form change
  const handleShopFormChange = (e) => {
    const { name, value } = e.target;
    setShopForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle product form change
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle sale form change
  const handleSaleFormChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle shop submission
  const handleShopSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be signed in to add a shop");
      return;
    }
    
    if (!shopForm.name || !shopForm.location) {
      setError("Please fill in all required fields.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log("Submitting shop with user ID:", user.uid);
      const shopId = await addShop(shopForm, user.uid);
      
      // Add the new shop to the shops list with proper timestamps
      const newShop = { 
        id: shopId, 
        ...shopForm, 
        userId: user.uid,
        createdAt: new Date()
      };
      
      console.log("Shop added successfully:", newShop);
      setShops((prevShops) => [newShop, ...prevShops]);
      closeModal();
      setLoading(false);
    } catch (error) {
      console.error("Error adding shop:", error);
      setError(`Failed to add shop: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };
  
  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be signed in to add a product");
      return;
    }
    
    if (!productForm.name || !productForm.price) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (!selectedShop) {
      setError("Please select a shop first.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log("Submitting product with shop ID:", selectedShop.id, "and user ID:", user.uid);
      const productId = await addProduct(productForm, selectedShop.id, user.uid);
      
      // Add the new product to the products list with proper timestamps
      const newProduct = { 
        id: productId, 
        ...productForm, 
        shopId: selectedShop.id,
        userId: user.uid,
        createdAt: new Date()
      };
      
      console.log("Product added successfully:", newProduct);
      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      closeModal();
      setLoading(false);
    } catch (error) {
      console.error("Error adding product:", error);
      setError(`Failed to add product: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };
  
  // Handle sale submission
  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be signed in to record a sale");
      return;
    }
    
    if (!saleForm.quantity) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (!selectedProduct) {
      setError("Please select a product first.");
      return;
    }
    
    if (!selectedShop) {
      setError("Shop information is missing.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log("Recording sale for product ID:", selectedProduct.id, "shop ID:", selectedShop.id, "and user ID:", user.uid);
      await addSale(
        saleForm, 
        selectedProduct.id, 
        selectedShop.id, 
        user.uid
      );
      
      // Update the product stock in the UI
      if (selectedProduct.stock) {
        const newStock = parseInt(selectedProduct.stock) - parseInt(saleForm.quantity);
        const updatedProduct = {
          ...selectedProduct,
          stock: Math.max(0, newStock).toString()
        };
        
        console.log("Updating product stock:", updatedProduct);
        setProducts((prevProducts) => 
          prevProducts.map(prod => 
            prod.id === selectedProduct.id ? updatedProduct : prod
          )
        );
        
        setSelectedProduct(updatedProduct);
      }
      
      console.log("Sale recorded successfully");
      closeModal();
      setLoading(false);
    } catch (error) {
      console.error("Error adding sale:", error);
      setError(`Failed to record sale: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };
  
  // Handle shop selection
  const selectShop = (shop) => {
    setSelectedShop(shop);
    setSelectedProduct(null);
    setActiveStep("products");
  };
  
  // Handle product selection
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setActiveStep("sales");
  };
  
  // Navigate back
  const navigateBack = () => {
    if (activeStep === "products") {
      setActiveStep("shops");
      setSelectedShop(null);
    } else if (activeStep === "sales") {
      setActiveStep("products");
      setSelectedProduct(null);
    }
  };
  
  // If authentication is loading, show loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600">Checking authentication...</p>
      </div>
    );
  }
  
  // If user is not logged in, show access denied message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access this page.</p>
          <a href="/signin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Sign In
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your shops, products, and sales</p>
          </div>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-sm">
            <span 
              className={`cursor-pointer ${activeStep === "shops" ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveStep("shops")}
            >
              Shops
            </span>
            <FiChevronRight className="text-gray-400" />
            
            <span 
              className={`cursor-pointer ${activeStep === "products" ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"} 
                ${!selectedShop ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => selectedShop && setActiveStep("products")}
            >
              Products
            </span>
            <FiChevronRight className="text-gray-400" />
            
            <span 
              className={`cursor-pointer ${activeStep === "sales" ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}
                ${!selectedProduct ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => selectedProduct && setActiveStep("sales")}
            >
              Sales
            </span>
          </div>
        </div>
        
        {/* Context Bar */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col mb-4 md:mb-0">
            {activeStep === "products" && selectedShop && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Selected Shop:</span>
                <span className="font-medium text-gray-900">{selectedShop.name}</span>
              </div>
            )}
            
            {activeStep === "sales" && selectedShop && selectedProduct && (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Shop:</span>
                  <span className="font-medium text-gray-900">{selectedShop.name}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 mr-2">Product:</span>
                  <span className="font-medium text-gray-900">{selectedProduct.name}</span>
                  <span className="ml-2 text-gray-500">(${selectedProduct.price})</span>
                  {selectedProduct.stock && (
                    <span className="ml-2 text-gray-500">Stock: {selectedProduct.stock}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-auto flex">
            {activeStep !== "shops" && (
              <button
                onClick={navigateBack}
                className="flex items-center px-3 py-2 border border-gray-300 rounded mr-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
            )}
            
            <button
              onClick={() => openModal(activeStep === "shops" ? "shop" : activeStep === "products" ? "product" : "sale")}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 w-full md:w-auto justify-center"
              disabled={
                (activeStep === "products" && !selectedShop) ||
                (activeStep === "sales" && !selectedProduct)
              }
            >
              <FiPlus className="mr-1" />
              Add {activeStep === "shops" ? "Shop" : activeStep === "products" ? "Product" : "Sale"}
            </button>
          </div>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className="bg-white shadow rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Shops View */}
              {activeStep === "shops" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiShoppingBag className="mr-2 text-blue-500" /> Your Shops
                  </h2>
                  
                  {shops.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No shops</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new shop.</p>
                      <div className="mt-6">
                        <button
                          onClick={() => openModal("shop")}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                          Add Shop
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shops.map((shop) => (
                        <div
                          key={shop.id}
                          onClick={() => selectShop(shop)}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Shop
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{shop.location}</p>
                          {shop.description && (
                            <p className="mt-2 text-sm text-gray-700 line-clamp-2">{shop.description}</p>
                          )}
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Created: {shop.createdAt?.toDate ? new Date(shop.createdAt.toDate()).toLocaleDateString() : new Date(shop.createdAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectShop(shop);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Manage Products →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Products View */}
              {activeStep === "products" && selectedShop && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiBox className="mr-2 text-blue-500" /> Products for {selectedShop.name}
                  </h2>
                  
                  {products.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <FiBox className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new product for this shop.</p>
                      <div className="mt-6">
                        <button
                          onClick={() => openModal("product")}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                          Add Product
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr 
                              key={product.id} 
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => selectProduct(product)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${product.price}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.stock || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 truncate max-w-xs">{product.description || "No description"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectProduct(product);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 mr-3"
                                >
                                  Record Sale
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {/* Sales View */}
              {activeStep === "sales" && selectedProduct && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiDollarSign className="mr-2 text-blue-500" /> Record Sale for {selectedProduct.name}
                  </h2>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiDollarSign className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          To record a sale for this product, click the "Add Sale" button. This will deduct from the product's stock.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Product</h3>
                        <p className="text-lg font-medium text-gray-900">{selectedProduct.name}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                        <p className="text-lg font-medium text-gray-900">${selectedProduct.price}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Current Stock</h3>
                        <p className="text-lg font-medium text-gray-900">{selectedProduct.stock || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => openModal("sale")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                        Add Sale
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "shop" 
                  ? "Add New Shop" 
                  : modalType === "product" 
                    ? "Add New Product" 
                    : "Record New Sale"}
              </h2>
              
              {/* Shop Form */}
              {modalType === "shop" && (
                <form onSubmit={handleShopSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={shopForm.name}
                      onChange={handleShopFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={shopForm.location}
                      onChange={handleShopFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={shopForm.description}
                      onChange={handleShopFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add Shop
                    </button>
                  </div>
                </form>
              )}
              
              {/* Product Form */}
              {modalType === "product" && (
                <form onSubmit={handleProductSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleProductFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              )}
              
              {/* Sale Form */}
              {modalType === "sale" && (
                <form onSubmit={handleSaleSubmit}>
                  <div className="mb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="font-medium text-gray-700 mr-1">Product:</span> {selectedProduct.name}
                      <span className="mx-2">|</span>
                      <span className="font-medium text-gray-700 mr-1">Price:</span> ${selectedProduct.price}
                      {selectedProduct.stock && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="font-medium text-gray-700 mr-1">Available:</span> {selectedProduct.stock}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={saleForm.quantity}
                      onChange={handleSaleFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="1"
                      min="1"
                      max={selectedProduct.stock || 9999}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={saleForm.date}
                      onChange={handleSaleFormChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Total Sale Value:</span>
                      <span className="font-medium text-gray-900">
                        ${Number(saleForm.quantity || 0) * Number(selectedProduct.price || 0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Record Sale
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;



