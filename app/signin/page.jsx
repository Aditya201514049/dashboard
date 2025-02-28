import React from 'react';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
};

export default SignInPage;