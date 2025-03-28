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
  const publicPaths = ['/signin', '/signup'];

  useEffect(() => {
    console.log('Setting up auth state listener, current auth:', auth);
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log('Auth state changed:', { 
        isAuthenticated: !!authUser, 
        userId: authUser?.uid,
        email: authUser?.email
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

      // If user is not authenticated and trying to access a protected route
      if (!authUser && !publicPaths.includes(pathname) && typeof window !== 'undefined') {
        console.log('User not authenticated, redirecting to signin');
        router.push('/signin');
      } else if (authUser) {
        console.log('User is authenticated, access granted to:', pathname);
      }
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
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