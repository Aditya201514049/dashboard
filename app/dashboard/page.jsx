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
  Info,
  X
} from "lucide-react";
import { Loader2 } from "lucide-react";

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

// Helper function to format dates as relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [date, setDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError(null);
        console.log("Loading global data...");

        // Add safety checks to prevent errors
        if (!db) {
          console.error("Firestore DB not initialized");
          setError("Database connection error");
          setLoading(false);
          return;
        }

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
          if (saleData.unitPrice && saleData.quantity) {
            totalRevenue += parseFloat(saleData.unitPrice) * parseInt(saleData.quantity || 1);
          }
        });

        // Get monthly revenue data for the chart
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = Array(12).fill(0);

        // Calculate revenue by month
        salesQuerySnapshot.forEach((doc) => {
          const saleData = doc.data();
          if (saleData.unitPrice && saleData.quantity && saleData.createdAt) {
            const saleDate = saleData.createdAt.toDate ? saleData.createdAt.toDate() : new Date(saleData.createdAt);
            if (saleDate.getFullYear() === currentYear) {
              const month = saleDate.getMonth();
              const saleAmount = parseFloat(saleData.unitPrice) * parseInt(saleData.quantity || 1);
              monthlyRevenue[month] += saleAmount;
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
        const recentSalesQuery = query(salesRef, orderBy("createdAt", "desc"), limit(5));
        const recentSalesSnapshot = await getDocs(recentSalesQuery);
        const recentSales = recentSalesSnapshot.docs.map(doc => {
          const data = doc.data();
          const saleDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          const amount = data.unitPrice && data.quantity 
            ? parseFloat(data.unitPrice) * parseInt(data.quantity || 1)
            : 0;
          
          return {
            id: doc.id,
            date: saleDate.toLocaleDateString(),
            description: data.productName ? `Sale of ${data.productName}` : 'Sale',
            amount: amount,
            status: 'completed'
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

        // Fetch recent activities
        try {
          const activitiesRef = collection(db, "activities");
          const activitiesQuery = query(
            activitiesRef, 
            orderBy("createdAt", "desc"), 
            limit(5)
          );
          
          const activitiesSnapshot = await getDocs(activitiesQuery);
          if (!activitiesSnapshot.empty) {
            const recentActivities = activitiesSnapshot.docs.map(doc => {
              const data = doc.data();
              const activityDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              
              // Calculate relative time (e.g., "2 hours ago")
              const timeAgo = getRelativeTime(activityDate);
              
              return {
                id: doc.id,
                type: data.type || 'update', // Default to 'update' if no type
                text: data.text || 'Activity recorded',
                time: timeAgo,
                userName: data.userName || 'A user',
                userId: data.userId || ''
              };
            });
            
            setActivities(recentActivities);
          }
        } catch (activityError) {
          console.error("Error loading activities:", activityError);
        }

        setLoading(false);
        console.log("Global data loaded successfully");
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    // Only load data if user is authenticated
    if (user && !authLoading) {
      loadGlobalData();
    } else if (!authLoading && !user) {
      // If not authenticated and not loading, set error
      setError("Authentication required");
      setLoading(false);
    }
  }, [user, authLoading]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('BDT', '৳');
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

  // Add a fallback UI for errors
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-4">
          <Info className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
          <p className="text-gray-600 mt-2">
            {error === "Authentication required" 
              ? "Please sign in to access your dashboard" 
              : "There was a problem loading your dashboard"}
          </p>
        </div>
        {error === "Authentication required" ? (
          <Button 
            onClick={() => window.location.href = '/signin'}
            className="mt-4"
          >
            Go to Sign In
          </Button>
        ) : (
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Enhanced loading state
  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

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
              {globalStats.totalUsers}
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
              {formatCurrency(globalStats.totalRevenue)}
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
              {globalStats.totalSales}
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
              {globalStats.totalProducts}
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
                      tickFormatter={(value) => `৳${value.toLocaleString('en-US')}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`৳${value.toLocaleString('en-US')}`, 'Revenue']}
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
              <div className="text-3xl font-bold mb-4">{globalStats.totalShops}</div>
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
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-medium">No recent activities</p>
                  <p className="text-xs mt-1">Activities will appear here as users interact with the platform</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {activities.map(activity => (
                    <li key={activity.id} className="flex items-start gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityBadge(activity.type)}`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {activity.userName && activity.userName !== 'A user' 
                            ? <span className="font-medium">{activity.userName}</span> 
                            : ''}
                          {' '}{activity.text}
                        </span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
