

"use client";

import React, { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Use this instead of useClerk
import { app } from "@/lib/firebase"; // Ensure this is correctly set up

const SignUpPage = () => {
  const router = useRouter();
  const { isSignedIn, user } = useUser(); // Get the authenticated user

  useEffect(() => {
    const addUserToFirestore = async () => {
      if (isSignedIn && user) {
        try {
          const db = getFirestore(app);
          const userRef = doc(db, "users", user.id); // Create a document with user ID

          await setDoc(userRef, {
            email: user.emailAddresses[0].emailAddress, // Clerk stores emails in an array
            displayName: user.firstName || "New User",
            createdAt: serverTimestamp(),
          });

          router.push("/signin"); // Redirect after adding user to Firestore
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
        }
      }
    };

    addUserToFirestore();
  }, [isSignedIn, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp path="/signup" routing="path" signInUrl="/signin" />
    </div>
  );
};

export default SignUpPage;
