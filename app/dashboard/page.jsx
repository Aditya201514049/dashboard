"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Protected from "@/components/Protected";
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Layers,
  Package,
  Activity,
  ShoppingBag,
  BarChart,
  PieChart,
  Info
} from "lucide-react";

// Recharts components for data visualization
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Import Firebase services if needed for authentication
import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firestore";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  getCountFromServer,
  sum,
  getAggregateFromServer,
  Timestamp,
  addDoc
} from "firebase/firestore";

// Custom Taka icon component
const TakaIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <text x="6" y="18" fontSize="16" fontWeight="bold" stroke="currentColor" fill="currentColor">৳</text>
  </svg>
);

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [date, setDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    totalShops: 0
  });
  const [userStats, setUserStats] = useState({
    userShops: 0,
    userProducts: 0,
    userSales: 0,
    userRevenue: 0
  });

  // For revenue data over time
  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4000 },
    { name: 'May', revenue: 7000 },
    { name: 'Jun', revenue: 6000 },
    { name: 'Jul', revenue: 8000 },
  ]);

  // For sales by category
  const [salesByCategory, setSalesByCategory] = useState([
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 300 },
    { name: 'Books', value: 200 },
    { name: 'Other', value: 100 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Daily traffic data
  const [trafficData, setTrafficData] = useState([
    { day: 'Mon', visits: 4000, pageViews: 2400 },
    { day: 'Tue', visits: 3000, pageViews: 1398 },
    { day: 'Wed', visits: 2000, pageViews: 9800 },
    { day: 'Thu', visits: 2780, pageViews: 3908 },
    { day: 'Fri', visits: 1890, pageViews: 4800 },
    { day: 'Sat', visits: 2390, pageViews: 3800 },
    { day: 'Sun', visits: 3490, pageViews: 4300 },
  ]);

  // Transactions data
  const [transactions, setTransactions] = useState([
    { id: 1, date: '02/20/2025', description: 'Payment Received', amount: 200, status: 'completed' },
    { id: 2, date: '02/21/2025', description: 'Invoice Paid', amount: 150, status: 'pending' },
    { id: 3, date: '02/22/2025', description: 'Subscription Fee', amount: 50, status: 'failed' },
    { id: 4, date: '02/23/2025', description: 'Product Purchase', amount: 300, status: 'completed' },
    { id: 5, date: '02/24/2025', description: 'Service Fee', amount: 75, status: 'completed' },
  ]);

  // Activity data
  const [activities, setActivities] = useState([
    { id: 1, type: 'new', text: 'John added 3 new products', time: '2 hours ago' },
    { id: 2, type: 'update', text: 'Price change for SKU-123456', time: '4 hours ago' },
    { id: 3, type: 'restock', text: '20 units of Product XYZ added to inventory', time: '1 day ago' },
    { id: 4, type: 'sale', text: 'New sale of ৳500 recorded', time: '1 day ago' },
    { id: 5, type: 'customer', text: 'New customer registered', time: '2 days ago' },
  ]);

  // Load real data for all users - both authenticated and non-authenticated
  useEffect(() => {
    async function loadGlobalData() {
      try {
        setLoading(true);
        console.log("Loading global data...");

        // Count total users
        const usersRef = collection(db, "users");
        const usersSnapshot = await getCountFromServer(usersRef);
        const totalUsers = usersSnapshot.data().count;

        // Count total shops
        const shopsRef = collection(db, "shops");
        const shopsSnapshot = await getCountFromServer(shopsRef);
        const totalShops = shopsSnapshot.data().count;

        // Count total products
        const productsRef = collection(db, "products");
        const productsSnapshot = await getCountFromServer(productsRef);
        const totalProducts = productsSnapshot.data().count;

        // Count total sales and sum revenue
        const salesRef = collection(db, "sales");
        const salesSnapshot = await getCountFromServer(salesRef);
        const totalSales = salesSnapshot.data().count;

        // Calculate total revenue (if your sales collection has an amount field)
        let totalRevenue = 0;
        const salesQuery = query(salesRef, limit(100));
        const salesQuerySnapshot = await getDocs(salesQuery);
        salesQuerySnapshot.forEach((doc) => {
          const saleData = doc.data();
          if (saleData.amount) {
            totalRevenue += saleData.amount;
          }
        });

        // Get monthly revenue data for the chart
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = Array(12).fill(0);

        // Calculate revenue by month
        salesQuerySnapshot.forEach((doc) => {
          const saleData = doc.data();
          if (saleData.amount && saleData.date && saleData.date instanceof Timestamp) {
            const saleDate = saleData.date.toDate();
            if (saleDate.getFullYear() === currentYear) {
              const month = saleDate.getMonth();
              monthlyRevenue[month] += saleData.amount;
            }
          }
        });

        // Format for chart
        const chartData = monthNames.map((name, index) => ({
          name,
          revenue: monthlyRevenue[index]
        }));

        // Get sales by category
        const categories = {};
        const productsQuery = query(productsRef, limit(100));
        const productsQuerySnapshot = await getDocs(productsQuery);
        
        // Count products by category
        productsQuerySnapshot.forEach((doc) => {
          const productData = doc.data();
          const category = productData.category || 'Other';
          if (!categories[category]) {
            categories[category] = 0;
          }
          categories[category]++;
        });

        // Format for pie chart
        const categoryData = Object.entries(categories).map(([name, value]) => ({
          name,
          value
        }));

        // Get recent transactions
        const recentSalesQuery = query(salesRef, orderBy("date", "desc"), limit(5));
        const recentSalesSnapshot = await getDocs(recentSalesQuery);
        const recentSales = recentSalesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date instanceof Timestamp ? data.date.toDate().toLocaleDateString() : 'Unknown',
            description: data.description || 'Sale',
            amount: data.amount || 0,
            status: data.status || 'completed'
          };
        });

        // Update states with real data
        setGlobalStats({
          totalUsers,
          totalRevenue,
          totalSales,
          totalProducts,
          totalShops
        });

        // Only update these if we have real data
        if (chartData.some(item => item.revenue > 0)) {
          setRevenueData(chartData);
        }
        
        if (categoryData.length > 0) {
          setSalesByCategory(categoryData);
        }
        
        if (recentSales.length > 0) {
          setTransactions(recentSales);
        }

        setLoading(false);
        console.log("Global data loaded successfully");
      } catch (error) {
        console.error("Error loading global data:", error);
        setLoading(false);
      }
    }

    async function loadUserData() {
      try {
        if (user) {
          console.log("Loading user-specific data...");
          const userId = user.uid;

          // Count user's shops
          const userShopsQuery = query(collection(db, "shops"), where("userId", "==", userId));
          const userShopsSnapshot = await getCountFromServer(userShopsQuery);
          const userShops = userShopsSnapshot.data().count;

          // Get user's shop IDs
          const userShopsIdsSnapshot = await getDocs(userShopsQuery);
          const shopIds = userShopsIdsSnapshot.docs.map(doc => doc.id);

          // Count user's products
          let userProducts = 0;
          let userSales = 0;
          let userRevenue = 0;

          // If user has shops, get product and sales data
          if (shopIds.length > 0) {
            for (const shopId of shopIds) {
              // Count products for this shop
              const productsQuery = query(collection(db, "products"), where("shopId", "==", shopId));
              const productsSnapshot = await getCountFromServer(productsQuery);
              userProducts += productsSnapshot.data().count;

              // Count sales and sum revenue for this shop
              const salesQuery = query(collection(db, "sales"), where("shopId", "==", shopId));
              const salesSnapshot = await getCountFromServer(salesQuery);
              userSales += salesSnapshot.data().count;

              // Calculate revenue from sales
              const salesQuerySnapshot = await getDocs(salesQuery);
              salesQuerySnapshot.forEach((doc) => {
                const saleData = doc.data();
                if (saleData.amount) {
                  userRevenue += saleData.amount;
                }
              });
            }
          }

          // Update user-specific stats
          setUserStats({
            userShops,
            userProducts,
            userSales,
            userRevenue
          });

          console.log("User data loaded successfully");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
    
    // Load global data for all users
    loadGlobalData();
    
    // If authenticated, also load user-specific data
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(amount);
  };

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get badge color based on activity type
  const getActivityBadge = (type) => {
    switch (type) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'update':
        return 'bg-purple-100 text-purple-800';
      case 'restock':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-yellow-100 text-yellow-800';
      case 'customer':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Dashboard content that shows for all users
  const DashboardContent = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-2">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-gray-500 text-center md:text-left">
          {user ? `Welcome back, ${user.displayName || user.email || 'User'}!` : 'Welcome to the dashboard!'}
        </p>
        {!user && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-blue-800 text-sm">
              You're viewing public statistics. <a href="/signin" className="text-blue-600 font-semibold hover:underline">Sign in</a> to manage your own data and see detailed insights.
            </p>
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {loading ? '...' : globalStats.totalUsers}
              <Users className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Platform wide</span>
            </div>
            {user && (
              <div className="mt-2 text-xs text-gray-600">
                Your account: 1 user
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {loading ? '...' : formatCurrency(globalStats.totalRevenue)}
              <TakaIcon className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Platform wide</span>
            </div>
            {user && (
              <div className="mt-2 text-xs text-gray-600">
                Your revenue: {formatCurrency(userStats.userRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Total Sales</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {loading ? '...' : globalStats.totalSales}
              <ShoppingCart className="h-5 w-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Platform wide</span>
            </div>
            {user && (
              <div className="mt-2 text-xs text-gray-600">
                Your sales: {userStats.userSales}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {loading ? '...' : globalStats.totalProducts}
              <Package className="h-5 w-5 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Platform wide</span>
            </div>
            {user && (
              <div className="mt-2 text-xs text-gray-600">
                Your products: {userStats.userProducts}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Revenue Trends
                <TrendingUp className="h-5 w-5 text-green-500" />
              </CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `৳${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`৳${value}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
      </div>
            </CardContent>
          </Card>
          
          {/* Traffic Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Daily Traffic
                <Activity className="h-5 w-5 text-blue-500" />
              </CardTitle>
              <CardDescription>Visits and page views by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={trafficData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" fill="#8884d8" name="Visits" />
                    <Bar dataKey="pageViews" fill="#82ca9d" name="Page Views" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Transactions
                <TakaIcon className="h-5 w-5 text-green-500" />
              </CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-sm">{transaction.date}</TableCell>
                        <TableCell className="text-sm">{transaction.description}</TableCell>
                        <TableCell className="text-sm">{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">View All Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Shops Card - New card showing total shops */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Shops
                <ShoppingBag className="h-5 w-5 text-indigo-500" />
              </CardTitle>
              <CardDescription>Total shops on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{loading ? '...' : globalStats.totalShops}</div>
              {user && (
                <div className="text-sm text-gray-600">
                  Your shops: {userStats.userShops}
                  {userStats.userShops === 0 && user && (
                    <div className="mt-2">
                      <Button asChild variant="outline" size="sm">
                        <a href="/admin">Add Your First Shop</a>
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {!user && (
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <a href="/signin">Sign In to Add Shops</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Sales by Category Pie Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sales by Category
                <PieChart className="h-5 w-5 text-purple-500" />
              </CardTitle>
              <CardDescription>Distribution of sales by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Sales']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {salesByCategory.map((category, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                ))}
      </div>
            </CardContent>
          </Card>
          
          {/* Calendar Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Calendar
                <CalendarIcon className="h-5 w-5 text-slate-500" />
              </CardTitle>
              <CardDescription>Select a date to view data</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate}
                className="mx-auto"
              />
            </CardContent>
            <CardFooter>
              <p className="text-xs text-center w-full text-muted-foreground">
                Selected: {date.toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
          
          {/* Recent Activity */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activity
                <Activity className="h-5 w-5 text-blue-500" />
              </CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {activities.map(activity => (
                  <li key={activity.id} className="flex items-start gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityBadge(activity.type)}`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">{activity.text}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions Card */}
      <Card className="shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-slate-500" /> 
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used functions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {user ? (
            <>
              <Button asChild variant="default" size="sm">
                <a href="/admin">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Manage Shop
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <a href="/admin/dashboard">
                  <BarChart className="h-4 w-4 mr-1" />
                  Analytics
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/admin">
                  <Package className="h-4 w-4 mr-1" />
                  Products
                </a>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="default" size="sm">
                <a href="/signin">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Sign In
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <a href="/signup">
                  <Users className="h-4 w-4 mr-1" />
                  Register
                </a>
              </Button>
            </>
          )}
          <Button asChild variant="outline" size="sm">
            <a href="/about">
              <Info className="h-4 w-4 mr-1" />
              Help & Support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // We're removing the Protected wrapper since we want all users to see the dashboard
  return <DashboardContent />;
}
