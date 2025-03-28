'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import Protected from '@/components/Protected';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <Protected>
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : userData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  {userData.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt={userData.displayName || "User"} 
                      className="w-24 h-24 rounded-full mb-4 border-4 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 border-4 border-primary">
                      <span className="text-2xl font-bold text-gray-600">
                        {userData.displayName?.charAt(0) || userData.email?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">{userData.displayName || "User"}</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Email</h3>
                    <p className="text-lg">{userData.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">User ID</h3>
                    <p className="text-lg font-mono bg-gray-100 p-2 rounded">{userData.uid}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Account Created</h3>
                    <p className="text-lg">
                      {userData.createdAt?.toDate 
                        ? userData.createdAt.toDate().toLocaleDateString() 
                        : "Unknown"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Last Sign In</h3>
                    <p className="text-lg">
                      {userData.lastLogin?.toDate 
                        ? userData.lastLogin.toDate().toLocaleDateString() 
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sign In Method</h3>
                    <div className="flex items-center bg-gray-100 p-3 rounded">
                      <div className="rounded-full bg-white p-2 mr-3">
                        <svg className="w-6 h-6" viewBox="0 0 48 48">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                      </div>
                      <span>Google Account</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Security Settings</h3>
                    <button className="btn btn-primary w-full mb-2">
                      Change Password
                    </button>
                    <button className="btn btn-outline w-full">
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Danger Zone</h3>
                    <button className="btn btn-error w-full">
                      Delete Account
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <p>Could not load user profile. Please try again later.</p>
          </div>
        )}
      </div>
    </Protected>
  );
} 