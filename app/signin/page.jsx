/*
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import GoogleSignIn from '@/components/GoogleSignIn';

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/'); // Redirect to Home page if user is already signed in
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="card w-96 bg-base-100 shadow-2xl p-8 transform transition duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Dashboard-App</h1>
        <p className="text-center text-gray-500 mb-6">Sign in to continue</p>
        <GoogleSignIn />
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
*/

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import GoogleSignIn from '@/components/GoogleSignIn';
import { createUserDocument } from '@/lib/firestore'; // Import your Firestore function

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Create/update user document in Firestore
          await createUserDocument(user, {
            lastLogin: new Date(),
            // Add any additional fields you want to track
          });
          
          // Redirect after successful document handling
          router.push('/');
        } catch (error) {
          console.error("Error handling user document:", error);
          // Optionally show error to user
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
        <GoogleSignIn onSuccess={handleSignInSuccess} />
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

// Add this handler for immediate feedback
const handleSignInSuccess = async (user) => {
  try {
    await createUserDocument(user, {
      lastLogin: new Date(),
      signInMethod: 'google'
    });
  } catch (error) {
    console.error("Error handling user document:", error);
  }
};

export default SignInPage;
