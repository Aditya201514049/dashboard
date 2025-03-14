'use client';

import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const GoogleSignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // User info: result.user
      router.push('/'); // Redirect to the desired page after successful login
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M46.62 24.56c0-1.54-.14-3.02-.4-4.44H24v8.99h12.85c-.6 3.02-2.35 5.57-4.98 7.28v6h8.02c4.7-4.33 7.43-10.68 7.43-18.03z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.9-2.14 15.87-5.78l-8.02-6c-2.21 1.48-5.02 2.37-7.85 2.37-6.04 0-11.16-4.07-13-9.58H2.72v6.12C6.69 42.5 14.74 48 24 48z"
            />
            <path
              fill="#FBBC05"
              d="M11 28.02c-.5-1.48-.76-3.05-.76-4.65s.26-3.17.76-4.65v-6.12H2.72A23.95 23.95 0 000 24c0 3.88.94 7.56 2.72 10.88l8.28-6.86z"
            />
            <path
              fill="#EA4335"
              d="M24 9.52c3.48 0 6.6 1.2 9.06 3.58l6.78-6.78C35.9 2.14 30.48 0 24 0 14.74 0 6.69 5.5 2.72 13.35l8.28 6.86c1.83-5.51 6.95-9.58 13-9.58z"
            />
          </svg>
          <span className="text-sm font-medium">Sign in with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleSignIn;