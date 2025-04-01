'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-4">
        <Info className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
        <p className="text-gray-600 mt-2">
          {error?.message || 'There was a problem loading your dashboard'}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="mt-4">
          Try Again
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="mt-4"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
} 