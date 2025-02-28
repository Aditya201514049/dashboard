import { Geist, Geist_Mono } from "next/font/google";

import { Metadata } from 'next'
import {ClerkProvider} from '@clerk/nextjs'
import Navbar from "@/components/ui/navbar";

import "./globals.css";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard-App",
  description: "This is a dashboard app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en"> 
          <body>  
          <Navbar/>

          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
