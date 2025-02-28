import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const Navbar = () => {
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
            <UserButton className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary transition" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
