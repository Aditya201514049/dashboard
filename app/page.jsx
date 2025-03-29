
'use client';

import { BarChart2, ShoppingBag, User, LineChart, PieChart, PackageCheck, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Welcome to Dashboard App</h1>
        <p className="text-lg md:text-xl text-gray-600">Your complete solution for monitoring and managing your business</p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link href="/dashboard" className="card bg-secondary text-secondary-content shadow-xl p-4 md:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-6 w-6 mr-2 text-secondary-content" />
              <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
            </div>
            <p>Access your personalized dashboard with real-time analytics.</p>
            <div className="flex justify-end mt-4">
              <button className="btn btn-sm md:btn-md btn-outline border-secondary-content text-secondary-content hover:bg-white hover:text-secondary hover:border-white flex items-center">
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </Link>
          
          <Link href="/admin" className="card bg-secondary text-secondary-content shadow-xl p-4 md:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center mb-2">
              <ShoppingBag className="h-6 w-6 mr-2 text-secondary-content" />
              <h2 className="text-xl md:text-2xl font-bold">Admin Panel</h2>
            </div>
            <p>Manage your shops, products, and view sales data.</p>
            <div className="flex justify-end mt-4">
              <button className="btn btn-sm md:btn-md btn-outline border-secondary-content text-secondary-content hover:bg-white hover:text-secondary hover:border-white flex items-center">
                Go to Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </Link>
          
          <Link href="/profile" className="card bg-accent text-accent-content shadow-xl p-4 md:p-6 hover:scale-105 transition-transform md:col-span-2">
            <div className="flex items-center mb-2">
              <User className="h-6 w-6 mr-2 text-accent-content" />
              <h2 className="text-xl md:text-2xl font-bold">User Profile</h2>
            </div>
            <p>View and manage your account settings and personal information.</p>
            <div className="flex justify-end mt-4">
              <button className="btn btn-sm md:btn-md btn-outline border-accent-content text-accent-content hover:bg-white hover:text-accent hover:border-white flex items-center">
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </Link>
        </div>
      ) : (
        <div className="text-center p-6 bg-base-200 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center">
              <BarChart2 className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <p className="text-lg md:text-xl mb-6">Sign in to access your dashboard and admin features</p>
          <Link href="/signin" className="btn btn-primary btn-lg flex items-center mx-auto max-w-xs justify-center">
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            New users will be guided through a simple onboarding process.
          </p>
        </div>
      )}
      
      <div className="mt-12 p-4 md:p-6 bg-base-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Dashboard App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-200 p-4">
            <div className="flex items-center mb-2">
              <LineChart className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-bold">Real-time Analytics</h3>
            </div>
            <p>Monitor your business performance with up-to-date metrics and visual reports.</p>
          </div>
          <div className="card bg-base-200 p-4">
            <div className="flex items-center mb-2">
              <PackageCheck className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="text-lg font-bold">Inventory Management</h3>
            </div>
            <p>Keep track of your products and stock levels efficiently.</p>
          </div>
          <div className="card bg-base-200 p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
              <h3 className="text-lg font-bold">Sales Tracking</h3>
            </div>
            <p>Record and analyze your sales data to identify trends and opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

