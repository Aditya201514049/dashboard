
"use client";
import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold hover:underline">
          Dashboard
        </Link>
        <div className="flex space-x-4">
          <SignedOut>
            {/* Show Sign In and Sign Up buttons when user is signed out */}
            <SignInButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
            <SignUpButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
          </SignedOut>
          <SignedIn>
            {/* Show the user profile button with sign-out functionality */}
            <UserButton
              afterSignOutUrl="/signin" // Redirect to sign-in page after sign-out
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition"
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
