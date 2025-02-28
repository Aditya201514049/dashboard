import React from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp routing="path" signInUrl="/signin" />
    </div>
  );
};

export default SignUpPage;
