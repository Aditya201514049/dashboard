"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import Cookies from 'js-cookie';
import { Menu, X, User, LogOut, BarChart2, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
                <div className="absolute right-4 top-12 bg-white/95 shadow-lg rounded-md p-2 text-xs text-gray-800 min-w-[120px] z-50">
                  <Link href="/profile" className="px-2 py-1.5 hover:bg-gray-100 rounded-sm flex items-center" onClick={() => setShowProfileOptions(false)}>
                    Profile
                  </Link>
                  <div className="my-1 h-px bg-gray-200"></div>
                  <button 
                    onClick={handleSignOut} 
                    className="px-2 py-1.5 hover:bg-gray-100 rounded-sm flex items-center w-full text-left text-red-600"
                  >
                    <LogOut size={12} className="mr-1" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Toggle Button - Hamburger/X icon */}
            <button 
              className="md:hidden h-8 w-8 flex items-center justify-center text-white transition-all duration-200 relative focus:outline-none" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X size={18} className="absolute" />
              ) : (
                <Menu size={18} className="absolute" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu - Modern Popup Style */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden fixed top-12 right-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden transform transition-all duration-200 ease-in-out origin-top-right"
        >
          <div className="py-1 flex flex-col">
            <Link 
              href="/" 
              className={`flex items-center px-4 py-2 text-sm ${pathname === "/" ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Home</span>
            </Link>
            <Link 
              href="/dashboard" 
              className={`flex items-center px-4 py-2 text-sm ${pathname === "/dashboard" ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 size={14} className="mr-2" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin" 
              className={`flex items-center px-4 py-2 text-sm ${pathname === "/admin" ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={14} className="mr-2" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;