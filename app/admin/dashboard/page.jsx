"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  getUserShops,
  getShopProducts,
  getShopSales,
  getProductSales,
  db
} from "@/lib/firestore";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

// Icons
import { 
  Calendar, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Users,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Search
} from "lucide-react";
import { TakaIcon } from "@/components/ui/taka-icon";

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Recharts Components
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [shops, setShops] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [globalStats, setGlobalStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [userStats, setUserStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  
  // Date range filtering
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date()
  });
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Load user shops and stats if user is logged in
  useEffect(() => {
    async function loadUserData() {
      if (user && !authLoading) {
        try {
          setLoading(true);
          
          // Get user's shops
          const userShops = await getUserShops(user.uid);
          setShops(userShops);
          
          // Set user stats
          setUserStats(prev => ({ ...prev, totalShops: userShops.length }));
          
          // Set first shop as selected if available
          if (userShops.length > 0 && !selectedShop) {
            setSelectedShop(userShops[0]);
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error loading user data:", error);
          setError("Failed to load your shop data.");
          setLoading(false);
        }
      }
    }
    
    loadUserData();
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
          setUserStats(prev => ({ ...prev, totalProducts: shopProducts.length }));
          
          // Load sales for the selected shop
          const shopSales = await getShopSales(selectedShop.id);
          
          // Filter sales by date range if needed
          const filteredSales = shopSales.filter(sale => {
            if (!dateRange.from || !dateRange.to) return true;
            
            const saleDate = sale.createdAt?.toDate ? 
              sale.createdAt.toDate() : 
              new Date(sale.createdAt);
              
            return saleDate >= dateRange.from && saleDate <= dateRange.to;
          });
          
          setSalesData(filteredSales);
          
          // Calculate total revenue and sales
          const totalRevenue = filteredSales.reduce((sum, sale) => {
            return sum + (parseFloat(sale.unitPrice) * parseInt(sale.quantity || 1));
          }, 0);
          
          setUserStats(prev => ({ 
            ...prev, 
            totalSales: filteredSales.length,
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
  }, [selectedShop, dateRange]);
  
  // Format currency with Taka symbol
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  };
  
  // Group sales by date
  const salesByDate = salesData.reduce((acc, sale) => {
    // Convert Firestore timestamp or date string to date string
    const saleDate = sale.date || 
      (sale.createdAt?.toDate ? 
        sale.createdAt.toDate().toISOString().split('T')[0] : 
        new Date(sale.createdAt).toISOString().split('T')[0]);
    
    if (!acc[saleDate]) {
      acc[saleDate] = {
        totalSales: 0,
        totalRevenue: 0,
      };
    }
    
    acc[saleDate].totalSales += 1;
    acc[saleDate].totalRevenue += parseFloat(sale.unitPrice) * parseInt(sale.quantity || 1);
    
    return acc;
  }, {});
  
  // Get sales data for chart display
  const getChartData = () => {
    const chartData = [];
    
    // Sort dates
    const sortedDates = Object.keys(salesByDate).sort();
    
    sortedDates.forEach(date => {
      chartData.push({
        date: date,
        sales: salesByDate[date].totalSales,
        revenue: salesByDate[date].totalRevenue
      });
    });
    
    return chartData;
  };
  
  // Get top selling products for pie chart
  const getTopSellingProducts = () => {
    const productSalesMap = {};
    
    salesData.forEach(sale => {
      if (!productSalesMap[sale.productId]) {
        productSalesMap[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName || 'Unknown Product',
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      
      productSalesMap[sale.productId].totalQuantity += parseInt(sale.quantity || 1);
      productSalesMap[sale.productId].totalRevenue += parseFloat(sale.unitPrice) * parseInt(sale.quantity || 1);
    });
    
    return Object.values(productSalesMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  };
  
  const chartData = getChartData();
  const topProducts = getTopSellingProducts();
  
  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Format percentage for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // If authentication is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Analytics and insights for your business</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            {/* Date Picker */}
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </span>
              </Button>
              
              {showCalendar && (
                <div className="absolute right-0 mt-2 p-4 bg-white rounded-md shadow-md z-10">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Start Date</h3>
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => 
                          setDateRange(prev => ({ ...prev, from: date }))
                        }
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">End Date</h3>
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => 
                          setDateRange(prev => ({ ...prev, to: date }))
                        }
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => setShowCalendar(false)}
                      className="mr-2"
                      variant="outline"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowCalendar(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Shop Selector (only show if user is logged in) */}
            {user && (
              <select
                value={selectedShop?.id || ""}
                onChange={(e) => {
                  const selected = shops.find(shop => shop.id === e.target.value);
                  setSelectedShop(selected);
                }}
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
            )}
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
            {/* User Stats (only if logged in) */}
            {user && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> 
                  Your Business Performance
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Your Shops</CardDescription>
                      <CardTitle className="text-2xl">{userStats.totalShops}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 text-blue-500 mr-1" /> 
                          <span className="text-xs text-muted-foreground">Total count</span>
                        </div>
                        <div className="flex items-center text-green-500">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span className="text-xs">100%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Your Products</CardDescription>
                      <CardTitle className="text-2xl">{userStats.totalProducts}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-green-500 mr-1" /> 
                          <span className="text-xs text-muted-foreground">In selected shop</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Your Sales</CardDescription>
                      <CardTitle className="text-2xl">{userStats.totalSales}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BarChart2 className="h-4 w-4 text-purple-500 mr-1" /> 
                          <span className="text-xs text-muted-foreground">In date range</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Your Revenue</CardDescription>
                      <CardTitle className="text-2xl">{formatCurrency(userStats.totalRevenue)}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TakaIcon className="h-4 w-4 text-yellow-500 mr-1" /> 
                          <span className="text-xs text-muted-foreground">In date range</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* New Performance Insights Card */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Insights</CardTitle>
                    <CardDescription>Detailed analytics for your shop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Average Sale Value */}
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <TakaIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Average Sale Value</h3>
                            <p className="text-sm text-gray-500">Per transaction</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold">
                            {userStats.totalSales > 0 
                              ? formatCurrency(userStats.totalRevenue / userStats.totalSales) 
                              : formatCurrency(0)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Revenue per Product */}
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Revenue per Product</h3>
                            <p className="text-sm text-gray-500">Average revenue generated</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold">
                            {userStats.totalProducts > 0 
                              ? formatCurrency(userStats.totalRevenue / userStats.totalProducts) 
                              : formatCurrency(0)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Best Selling Period */}
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <Calendar className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Best Selling Period</h3>
                            <p className="text-sm text-gray-500">Most active time</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold">
                            {dateRange.from.toLocaleDateString('en-US', {month: 'short'})}
                          </p>
                        </div>
                      </div>
                      
                      {/* Sales Growth */}
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-yellow-100 p-2 rounded-full mr-3">
                            <TrendingUp className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Sales Growth</h3>
                            <p className="text-sm text-gray-500">Current period</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold flex items-center">
                            <span className="text-green-500 mr-1">+15.2%</span>
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Sales Over Time */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>
                    Sales and revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {chartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">No sales data available for the selected period</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{fontSize: 12}} />
                          <YAxis yAxisId="left" tick={{fontSize: 12}} />
                          <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                          <Tooltip />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="sales"
                            stroke="#8884d8"
                            fill="#8884d8"
                            activeDot={{ r: 8 }}
                            name="Total Sales"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            name="Revenue (৳)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Product Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Revenue distribution by product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex flex-col">
                    {topProducts.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">No product data available</p>
                      </div>
                    ) : (
                      <>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={topProducts}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="totalRevenue"
                                nameKey="productName"
                              >
                                {topProducts.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(value)} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2">
                          <div className="grid grid-cols-1 gap-1">
                            {topProducts.map((product, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className="truncate">{product.productName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sales Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {salesData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No sales data available for the selected period.</p>
                    {user && (
                      <a 
                        href="/admin" 
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Admin
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price (৳)</TableHead>
                          <TableHead className="text-right">Total (৳)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.slice(0, 10).map((sale, index) => {
                          const saleDate = sale.createdAt?.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
                          const total = parseFloat(sale.unitPrice) * parseInt(sale.quantity || 1);
                          
                          return (
                            <TableRow key={sale.id || index}>
                              <TableCell>{saleDate.toLocaleDateString()}</TableCell>
                              <TableCell>{sale.productName || "Unknown Product"}</TableCell>
                              <TableCell>{sale.quantity || 1}</TableCell>
                              <TableCell>{formatCurrency(sale.unitPrice)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                      {salesData.length > 10 && (
                        <TableCaption>
                          Showing 10 of {salesData.length} recent sales.
                        </TableCaption>
                      )}
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shop Structure (only if user is logged in) */}
            {user && selectedShop && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Shop Structure</CardTitle>
                  <CardDescription>Products and sales hierarchy</CardDescription>
                </CardHeader>
                <CardContent>
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
                                    <ShoppingBag className="h-5 w-5" />
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
                                                <Package className="h-4 w-4" />
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
                                                    <TakaIcon className="h-3 w-3 mr-1" /> 
                                                    {productSales.length} sales totaling 
                                                    {' ' + formatCurrency(productSales.reduce((sum, sale) => 
                                                      sum + (parseFloat(sale.unitPrice) * parseInt(sale.quantity || 1)), 0
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
                </CardContent>
              </Card>
            )}

            {/* Call to Action (only if user is logged in) */}
            {user && (
              <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardContent className="pt-6 pb-6">
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
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 