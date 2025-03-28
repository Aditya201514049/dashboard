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
import {
  db
} from "@/lib/firestore";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

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
    totalUsers: 1245,
    totalRevenue: 12340,
    totalSales: 340,
    totalProducts: 76
  });

  // Sample data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4000 },
    { name: 'May', revenue: 7000 },
    { name: 'Jun', revenue: 6000 },
    { name: 'Jul', revenue: 8000 },
  ];

  const salesByCategory = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 300 },
    { name: 'Books', value: 200 },
    { name: 'Other', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Daily traffic data
  const trafficData = [
    { day: 'Mon', visits: 4000, pageViews: 2400 },
    { day: 'Tue', visits: 3000, pageViews: 1398 },
    { day: 'Wed', visits: 2000, pageViews: 9800 },
    { day: 'Thu', visits: 2780, pageViews: 3908 },
    { day: 'Fri', visits: 1890, pageViews: 4800 },
    { day: 'Sat', visits: 2390, pageViews: 3800 },
    { day: 'Sun', visits: 3490, pageViews: 4300 },
  ];

  // Sample transactions data
  const transactions = [
    { id: 1, date: '02/20/2025', description: 'Payment Received', amount: 200, status: 'completed' },
    { id: 2, date: '02/21/2025', description: 'Invoice Paid', amount: 150, status: 'pending' },
    { id: 3, date: '02/22/2025', description: 'Subscription Fee', amount: 50, status: 'failed' },
    { id: 4, date: '02/23/2025', description: 'Product Purchase', amount: 300, status: 'completed' },
    { id: 5, date: '02/24/2025', description: 'Service Fee', amount: 75, status: 'completed' },
  ];

  // Sample activity data
  const activities = [
    { id: 1, type: 'new', text: 'John added 3 new products', time: '2 hours ago' },
    { id: 2, type: 'update', text: 'Price change for SKU-123456', time: '4 hours ago' },
    { id: 3, type: 'restock', text: '20 units of Product XYZ added to inventory', time: '1 day ago' },
    { id: 4, type: 'sale', text: 'New sale of $500 recorded', time: '1 day ago' },
    { id: 5, type: 'customer', text: 'New customer registered', time: '2 days ago' },
  ];

  // Load real data for authenticated users
  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          setLoading(true);
          // Here you can load real data from Firestore
          // For now we'll just use a timeout to simulate loading
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error("Error loading data:", error);
          setLoading(false);
        }
      } else {
        // For non-authenticated users, just show the sample data
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  // Use the Protected component conditional on user's auth status
  const DashboardContent = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-2">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-gray-500 text-center md:text-left">
          {user ? `Welcome back, ${user.displayName || user.email || 'User'}!` : 'Welcome to the dashboard!'}
        </p>
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
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              {formatCurrency(globalStats.totalRevenue)}
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>8% from last month</span>
            </div>
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
              <span>5% from last month</span>
            </div>
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
              <span>3% from last month</span>
            </div>
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
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
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
                <DollarSign className="h-5 w-5 text-green-500" />
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
          <Button variant="default" size="sm">
            <ShoppingCart className="h-4 w-4 mr-1" />
            New Sale
          </Button>
          <Button variant="secondary" size="sm">
            <BarChart className="h-4 w-4 mr-1" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <Package className="h-4 w-4 mr-1" />
            Inventory
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" />
            Customers
          </Button>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-1" />
            Help & Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return user ? <DashboardContent /> : <DashboardContent />;
}
