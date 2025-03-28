"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase'; // Adjust the import based on your project structure
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();

 
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      
      // Clear the authentication cookie
      Cookies.remove('__session');
      
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-lg font-bold hover:underline">
            Home
          </Link>
          <Link href="/admin" className="text-lg font-bold hover:underline">
            Admin
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          {/* User Icon */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="/path/to/user-icon.png" alt="User Icon" />
              </div>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a onClick={handleSignOut}>Sign Out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;