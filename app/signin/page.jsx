'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import GoogleSignIn from '@/components/GoogleSignIn';
import { createUserDocument } from '@/lib/firestore';
import Cookies from 'js-cookie';

const SignInPage = () => {
  const router = useRouter();

  // Move handleSignInSuccess inside the component
  const handleSignInSuccess = async ({ user, isNewUser }) => {
    try {
      await createUserDocument(user, {
        lastLogin: new Date(),
        signInMethod: 'google',
        isNewUser
      });
      
      // Set a cookie for server-side auth checking (for middleware)
      Cookies.set('__session', 'authenticated', { 
        expires: 7, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      router.push(isNewUser ? '/onboarding' : '/dashboard');
    } catch (error) {
      console.error("Sign-in success handling error:", error);
    }
  };

  const handleSignInError = (error) => {
    console.error("Sign-in error:", error.message);
    // Add error state handling here if needed
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        // Only handle existing users here
        try {
          await createUserDocument(user, {
            lastLogin: new Date()
          });
          
          // Set a cookie for server-side auth checking (for middleware)
          Cookies.set('__session', 'authenticated', { 
            expires: 7, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
          
          // Redirect to dashboard if already signed in
          router.push('/dashboard');
        } catch (error) {
          console.error("Auth state change error:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="card w-96 bg-base-100 shadow-2xl p-8 transform transition duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Dashboard-App</h1>
        <p className="text-center text-gray-500 mb-6">Sign in to continue</p>
        <GoogleSignIn 
          onSuccess={handleSignInSuccess}
          onError={handleSignInError}
        />
        <p className="text-center text-gray-400 text-sm mt-4">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
