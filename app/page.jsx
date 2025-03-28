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
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Dashboard App</h1>
        <p className="text-xl text-gray-600">Your complete solution for monitoring and managing your business</p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard" className="card bg-primary text-primary-foreground shadow-xl p-6 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
            <p>Access your personalized dashboard with real-time analytics.</p>
          </Link>
          
          <Link href="/admin" className="card bg-secondary text-secondary-foreground shadow-xl p-6 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
            <p>Manage your shops, products, and view sales data.</p>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-6">Sign in to access your dashboard and admin features</p>
          <Link href="/signin" className="btn btn-primary btn-lg">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
