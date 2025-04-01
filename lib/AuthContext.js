'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from './firebase';
import { createUserDocument } from './firestore';

const AuthContext = createContext({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup', '/'];

  // Add a separate effect to handle authenticated user navigation
  useEffect(() => {
    // Only run on client and when user state has been determined (not loading)
    if (typeof window === 'undefined' || loading) return;
    
    // If user is authenticated and on signin/signup page, redirect to dashboard
    if (user && (pathname === '/signin' || pathname === '/signup')) {
      console.log('Redirecting authenticated user from auth page to dashboard');
      // Use replace instead of push to prevent back button issues
      router.replace('/dashboard');
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    console.log('Setting up auth state listener, current auth:', auth);
    
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      // Only update state if component is still mounted
      if (!isMounted) return;

      console.log('Auth state changed:', { 
        isAuthenticated: !!authUser, 
        userId: authUser?.uid,
        email: authUser?.email,
        currentPath: pathname
      });
      
      if (authUser) {
        // When user is authenticated, ensure they have a document in Firestore
        try {
          await createUserDocument(authUser);
          console.log('User document created/updated successfully');
        } catch (error) {
          console.error('Error creating/updating user document:', error);
        }
      }
      
      setUser(authUser);
      setLoading(false);

      // Only handle navigation if window exists (client-side)
      if (typeof window === 'undefined') return;

      // Handle user navigation based on auth state
      try {
        // If user is not authenticated and trying to access a protected route
        if (!authUser && !publicPaths.includes(pathname)) {
          console.log('User not authenticated, redirecting to signin');
          router.push('/signin');
        } 
        // We'll handle authenticated user redirection in the separate useEffect
        // to prevent race conditions during auth provider callbacks
        else if (authUser) {
          console.log('User is authenticated, access granted to:', pathname);
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, (error) => {
      if (isMounted) {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      isMounted = false;
      unsubscribe();
    };
  }, [pathname, router]);

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 