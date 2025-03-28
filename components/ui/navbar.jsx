"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import Cookies from 'js-cookie';
import { Menu, User, LogOut, BarChart2, ShoppingBag, Settings } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      Cookies.remove('__session');
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Active link style
  const isActive = (path) => {
    return pathname === path ? "text-white font-medium border-b border-white" : "text-white/90 hover:text-white";
  };

  return (
    <>
      <nav className="bg-primary h-12 sticky top-0 z-50 shadow-sm flex items-center">
        <div className="container mx-auto px-3 flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-sm">Dashboard App</Link>
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex space-x-6 items-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className={`text-xs transition-colors px-2 py-1 ${isActive("/")} flex items-center`}>
              <span>Home</span>
            </Link>
            <Link href="/dashboard" className={`text-xs transition-colors px-2 py-1 ${isActive("/dashboard")} flex items-center`}>
              <BarChart2 size={12} className="mr-1" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin" className={`text-xs transition-colors px-2 py-1 ${isActive("/admin")} flex items-center`}>
              <ShoppingBag size={12} className="mr-1" />
              <span>Admin</span>
            </Link>
            <Link href="/admin/dashboard" className={`text-xs transition-colors px-2 py-1 ${isActive("/admin/dashboard")} flex items-center`}>
              <Settings size={12} className="mr-1" />
              <span>Analytics</span>
            </Link>
          </div>
          
          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* User Controls */}
            <div className="flex items-center h-full">
              <button 
                onClick={() => setShowProfileOptions(!showProfileOptions)}
                className="h-8 w-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center focus:outline-none"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={14} className="text-white" />
                )}
              </button>
              
              {/* Horizontal Profile Options */}
              {showProfileOptions && (
                <div className="flex items-center ml-2 bg-white/10 rounded-full py-0.5 px-2 text-xs text-white">
                  <Link href="/profile" className="px-2 py-0.5 hover:underline whitespace-nowrap" onClick={() => setShowProfileOptions(false)}>
                    Profile
                  </Link>
                  <span className="mx-1">|</span>
                  <button onClick={handleSignOut} className="px-2 py-0.5 hover:underline whitespace-nowrap">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <button className="md:hidden h-8 w-8 flex items-center justify-center text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={16} />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu - Slide Down */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 shadow-md absolute w-full z-40">
          <div className="container mx-auto py-1 flex flex-col space-y-1 text-center">
            <Link href="/" className={`text-xs py-1 px-3 ${isActive("/")} flex items-center justify-center`} onClick={() => setIsMenuOpen(false)}>
              <span>Home</span>
            </Link>
            <Link href="/dashboard" className={`text-xs py-1 px-3 ${isActive("/dashboard")} flex items-center justify-center`} onClick={() => setIsMenuOpen(false)}>
              <BarChart2 size={12} className="mr-1" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin" className={`text-xs py-1 px-3 ${isActive("/admin")} flex items-center justify-center`} onClick={() => setIsMenuOpen(false)}>
              <ShoppingBag size={12} className="mr-1" />
              <span>Admin</span>
            </Link>
            <Link href="/admin/dashboard" className={`text-xs py-1 px-3 ${isActive("/admin/dashboard")} flex items-center justify-center`} onClick={() => setIsMenuOpen(false)}>
              <Settings size={12} className="mr-1" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;