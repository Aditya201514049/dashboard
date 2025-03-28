'use client';

import { Divide } from "lucide-react";
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
          <Link href="/dashboard" className="card bg-primary text-primary-content shadow-xl p-4 md:p-6 hover:scale-105 transition-transform">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Dashboard</h2>
            <p>Access your personalized dashboard with real-time analytics.</p>
            <div className="flex justify-end mt-4">
              <button className="btn btn-sm md:btn-md btn-outline border-primary-content text-primary-content hover:bg-primary-content hover:text-primary">
                View Dashboard
              </button>
            </div>
          </Link>
          
          <Link href="/admin" className="card bg-secondary text-secondary-content shadow-xl p-4 md:p-6 hover:scale-105 transition-transform">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Admin Panel</h2>
            <p>Manage your shops, products, and view sales data.</p>
            <div className="flex justify-end mt-4">
              <button className="btn btn-sm md:btn-md btn-outline border-secondary-content text-secondary-content hover:bg-secondary-content hover:text-secondary">
                Go to Admin
              </button>
            </div>
          </Link>
          
          <Link href="/profile" className="card bg-accent text-accent-content shadow-xl p-4 md:p-6 hover:scale-105 transition-transform md:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold mb-2">User Profile</h2>
            <p>View and manage your account settings and personal information.</p>
            <div className="flex justify-end mt-4">
              <button className="btn btn-sm md:btn-md btn-outline border-accent-content text-accent-content hover:bg-accent-content hover:text-accent">
                View Profile
              </button>
            </div>
          </Link>
        </div>
      ) : (
        <div className="text-center p-6 bg-base-200 rounded-lg shadow-md">
          <p className="text-lg md:text-xl mb-6">Sign in to access your dashboard and admin features</p>
          <Link href="/signin" className="btn btn-primary btn-lg">
            Sign In
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
            <h3 className="text-lg font-bold mb-2">Real-time Analytics</h3>
            <p>Monitor your business performance with up-to-date metrics and visual reports.</p>
          </div>
          <div className="card bg-base-200 p-4">
            <h3 className="text-lg font-bold mb-2">Inventory Management</h3>
            <p>Keep track of your products and stock levels efficiently.</p>
          </div>
          <div className="card bg-base-200 p-4">
            <h3 className="text-lg font-bold mb-2">Sales Tracking</h3>
            <p>Record and analyze your sales data to identify trends and opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
