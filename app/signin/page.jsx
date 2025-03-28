'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import GoogleSignIn from '@/components/GoogleSignIn';
import { createUserDocument } from '@/lib/firestore';
import Cookies from 'js-cookie';
import { ArrowRight, LineChart, ShieldCheck, Users } from 'lucide-react';

const SignInPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(false);
      
      if (user?.uid) {
        try {
          await createUserDocument(user, {
            lastLogin: new Date()
          });
          
          Cookies.set('__session', 'authenticated', { 
            expires: 7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
          
          router.push('/dashboard');
        } catch (error) {
          console.error("Auth state change error:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-secondary p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2">Dashboard App</h1>
          <p className="text-xl opacity-90">Manage your business metrics in one place</p>
        </div>
        
        {/* Features */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-semibold mb-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>Why choose us?</h2>
          
          <div className="flex items-start space-x-3 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="bg-white/20 p-2 rounded-lg">
              <LineChart size={20} className="animate-pulse-slow" />
            </div>
            <div>
              <h3 className="font-semibold">Real-time Analytics</h3>
              <p className="opacity-80 text-sm">Monitor your business performance with live data</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="bg-white/20 p-2 rounded-lg">
              <Users size={20} className="animate-pulse-slow" />
            </div>
            <div>
              <h3 className="font-semibold">Team Collaboration</h3>
              <p className="opacity-80 text-sm">Work together with your team seamlessly</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="bg-white/20 p-2 rounded-lg">
              <ShieldCheck size={20} className="animate-pulse-slow" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Platform</h3>
              <p className="opacity-80 text-sm">Your data is protected with enterprise-grade security</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 text-sm opacity-80 animate-fadeIn" style={{ animationDelay: '500ms' }}>
          © 2025 Dashboard App. All rights reserved.
        </div>
      </div>
      
      {/* Right panel - Login */}
      <div className="flex flex-col w-full md:w-1/2 bg-white p-6 md:p-12 justify-center items-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="mb-6">
              <GoogleSignIn 
                onSuccess={handleSignInSuccess}
                onError={handleSignInError}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary/90 hover:bg-primary text-white rounded-lg shadow-sm transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="text-sm font-medium">Coming Soon: Email Sign In</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
