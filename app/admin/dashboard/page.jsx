"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  getUserShops,
  getShopProducts,
  getShopSales,
  getProductSales,
} from "@/lib/firestore";

// Icons
import {
  FiShoppingBag,
  FiBox,
  FiDollarSign,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [shops, setShops] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  // Load user shops on component mount
  useEffect(() => {
    async function loadShops() {
      if (user && !authLoading) {
        try {
          setLoading(true);
          const userShops = await getUserShops(user.uid);
          setShops(userShops);
          setSummaryStats(prev => ({ ...prev, totalShops: userShops.length }));
          
          if (userShops.length > 0 && !selectedShop) {
            setSelectedShop(userShops[0]);
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error loading shops:", error);
          setError("Failed to load shops. Please try again.");
          setLoading(false);
        }
      }
    }

    loadShops();
  }, [user, authLoading]);

  // Load shop products and sales when a shop is selected
  useEffect(() => {
    async function loadShopData() {
      if (selectedShop) {
        try {
          setLoading(true);
          
          // Load products for the selected shop
          const shopProducts = await getShopProducts(selectedShop.id);
          setProductsData(shopProducts);
          setSummaryStats(prev => ({ ...prev, totalProducts: shopProducts.length }));
          
          // Load sales for the selected shop
          const shopSales = await getShopSales(selectedShop.id);
          setSalesData(shopSales);
          
          // Calculate total revenue and sales
          const totalRevenue = shopSales.reduce((sum, sale) => {
            return sum + (parseFloat(sale.unitPrice) * parseInt(sale.quantity));
          }, 0);
          
          setSummaryStats(prev => ({ 
            ...prev, 
            totalSales: shopSales.length,
            totalRevenue: totalRevenue
          }));
          
          setLoading(false);
        } catch (error) {
          console.error("Error loading shop data:", error);
          setError("Failed to load shop data. Please try again.");
          setLoading(false);
        }
      }
    }

    loadShopData();
  }, [selectedShop]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // If authentication is loading or user is not logged in
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access this page.</p>
          <a
            href="/signin"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Group sales by date
  const salesByDate = salesData.reduce((acc, sale) => {
    // Convert Firestore timestamp or date string to date string
    const saleDate = sale.date || 
      (sale.createdAt?.toDate ? sale.createdAt.toDate().toISOString().split('T')[0] : 
      new Date(sale.createdAt).toISOString().split('T')[0]);
    
    if (!acc[saleDate]) {
      acc[saleDate] = {
        totalSales: 0,
        totalRevenue: 0,
      };
    }
    
    acc[saleDate].totalSales += 1;
    acc[saleDate].totalRevenue += parseFloat(sale.unitPrice) * parseInt(sale.quantity);
    
    return acc;
  }, {});

  // Get sales data for last 7 days
  const getLast7DaysSales = () => {
    const dates = [];
    const salesCounts = [];
    const revenueData = [];
    
    // Generate the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
      
      // Check if we have sales for this date
      if (salesByDate[dateString]) {
        salesCounts.push(salesByDate[dateString].totalSales);
        revenueData.push(salesByDate[dateString].totalRevenue);
      } else {
        salesCounts.push(0);
        revenueData.push(0);
      }
    }
    
    return { dates, salesCounts, revenueData };
  };

  const { dates, salesCounts, revenueData } = getLast7DaysSales();
  
  // Get top selling products
  const getTopSellingProducts = () => {
    const productSalesMap = {};
    
    salesData.forEach(sale => {
      if (!productSalesMap[sale.productId]) {
        productSalesMap[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      
      productSalesMap[sale.productId].totalQuantity += parseInt(sale.quantity);
      productSalesMap[sale.productId].totalRevenue += parseFloat(sale.unitPrice) * parseInt(sale.quantity);
    });
    
    return Object.values(productSalesMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  };

  const topProducts = getTopSellingProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Analytics and insights for your business</p>
          </div>

          {/* Shop Selector */}
          <div className="mt-4 md:mt-0">
            <select
              value={selectedShop?.id || ""}
              onChange={(e) => {
                const selected = shops.find(shop => shop.id === e.target.value);
                setSelectedShop(selected);
              }}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {shops.length === 0 ? (
                <option value="">No shops available</option>
              ) : (
                shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))
              )}
            </select>
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Shops</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.totalShops}</h3>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <FiShoppingBag className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.totalProducts}</h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <FiBox className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Sales</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.totalSales}</h3>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <FiBarChart2 className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(summaryStats.totalRevenue)}</h3>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-full">
                    <FiDollarSign className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Sales Chart */}
              <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Last 7 Days</h3>
                <div className="h-64 relative">
                  {salesCounts.every(count => count === 0) ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">No sales data available</p>
                    </div>
                  ) : (
                    <div className="h-full flex items-end space-x-2">
                      {salesCounts.map((count, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t" 
                            style={{ 
                              height: `${count > 0 ? Math.max(15, (count / Math.max(...salesCounts)) * 100) : 0}%` 
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-2">{dates[index].split('-').slice(1).join('/')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Top Products</h3>
                {topProducts.length === 0 ? (
                  <div className="flex justify-center items-center h-52">
                    <p className="text-gray-500">No sales data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600 w-5">{index + 1}.</span>
                          <span className="ml-2 text-sm font-medium text-gray-800">{product.productName}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-gray-800">{formatCurrency(product.totalRevenue)}</span>
                          <span className="text-xs text-gray-500">{product.totalQuantity} sold</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Shop and Product Relationship */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b border-gray-200 p-5">
                <h3 className="text-lg font-medium text-gray-800">Shop Structure</h3>
              </div>
              <div className="p-5">
                {shops.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No shops available. Create a shop in the Admin page.</p>
                    <a 
                      href="/admin" 
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Go to Admin
                    </a>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <div className="min-w-max">
                      <div className="flex flex-col">
                        {shops.map((shop) => {
                          // Find products for this shop
                          const shopProducts = productsData.filter(product => 
                            selectedShop && product.shopId === selectedShop.id
                          );
                          
                          return (
                            <div key={shop.id} className={`mb-6 ${selectedShop?.id !== shop.id ? 'opacity-50' : ''}`}>
                              <div className="flex items-center mb-2">
                                <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-2">
                                  <FiShoppingBag className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-lg">{shop.name}</span>
                                {shop.location && <span className="ml-2 text-sm text-gray-500">({shop.location})</span>}
                              </div>
                              
                              {selectedShop?.id === shop.id && (
                                <div className="ml-8 pl-4 border-l-2 border-dashed border-gray-300">
                                  {shopProducts.length === 0 ? (
                                    <p className="text-gray-500 italic py-2">No products yet</p>
                                  ) : (
                                    shopProducts.map((product) => {
                                      // Find sales for this product
                                      const productSales = salesData.filter(sale => 
                                        sale.productId === product.id
                                      );
                                      
                                      return (
                                        <div key={product.id} className="mb-4">
                                          <div className="flex items-center mb-2">
                                            <div className="bg-green-100 text-green-800 rounded-full p-2 mr-2">
                                              <FiBox className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{product.name}</span>
                                            <span className="ml-2 text-sm text-gray-500">${product.price}</span>
                                            {product.stock && (
                                              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                                                Stock: {product.stock}
                                              </span>
                                            )}
                                          </div>
                                          
                                          <div className="ml-8 pl-4 border-l-2 border-dotted border-gray-200">
                                            {productSales.length === 0 ? (
                                              <p className="text-gray-500 italic py-1 text-sm">No sales yet</p>
                                            ) : (
                                              <div className="text-sm">
                                                <div className="flex items-center text-gray-500 mb-1">
                                                  <FiDollarSign className="h-3 w-3 mr-1" /> 
                                                  {productSales.length} sales totaling 
                                                  {' ' + formatCurrency(productSales.reduce((sum, sale) => 
                                                    sum + (parseFloat(sale.unitPrice) * parseInt(sale.quantity)), 0
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
              <div className="md:flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to add more data?</h3>
                  <p className="mb-4 md:mb-0 opacity-90">Go to the admin page to add shops, products, and record sales.</p>
                </div>
                <a
                  href="/admin"
                  className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition duration-150"
                >
                  Go to Admin
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 