"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function Page() {
  const [date, setDate] = useState(new Date()); // Ensure date is valid

  return (
    <div className="flex justify-center items-center h-screen">
      <Calendar 
        mode="single" 
        selected={date} 
        onSelect={setDate} 
        className="rounded-md border"
      />
    </div>
  );
}
