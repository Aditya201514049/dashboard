
"use client";

import React, { useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { app } from "@/lib/firebase";

const SignInPage = () => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    console.log("Effect running, isSignedIn:", isSignedIn, "user:", user);
    const saveUserToFirestore = async () => {
      if (isSignedIn && user) {
        try {
          const db = getFirestore(app);
          const userRef = doc(db, "users", user.id);

          // Check if user already exists
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // If user doesn't exist, save them to Firestore
            await setDoc(userRef, {
              email: user.emailAddresses[0].emailAddress,
              displayName: user.firstName || "New User",
              createdAt: serverTimestamp(),
            });

            console.log("User saved to Firestore:", user.id);
          } else {
            console.log("User already exists in Firestore.");
          }
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
        }
      }
    };

    saveUserToFirestore();
  }, [isSignedIn, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn path="/signin" routing="path" />
    </div>
  );
};

export default SignInPage;
