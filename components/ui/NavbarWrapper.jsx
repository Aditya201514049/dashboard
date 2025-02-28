"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Hide the Navbar on authentication pages
  const hideNavbar = pathname === "/signin" || pathname === "/signup";

  if (hideNavbar) return null;
  return <Navbar />;
}
