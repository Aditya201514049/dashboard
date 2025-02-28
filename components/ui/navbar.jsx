/*
"use client";
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const clerk = useClerk();

  const handleSignOut = async () => {
    await clerk.signOut();
    router.push('/signin');
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Dashboard</div>
        <div className="flex space-x-4">
          <SignedOut>
            <SignInButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
            <SignUpButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/signin"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition"
            />
            <button
              onClick={handleSignOut}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition"
            >
              Sign Out
            </button>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
*/

"use client";
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const clerk = useClerk();

  const handleSignOut = async () => {
    await clerk.signOut();
    router.push('/signin');
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold hover:underline">
          Dashboard
        </Link>
        <div className="flex space-x-4">
          <SignedOut>
            <SignInButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
            <SignUpButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/signin"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition"
            />
            <button
              onClick={handleSignOut}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition"
            >
              Sign Out
            </button>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;