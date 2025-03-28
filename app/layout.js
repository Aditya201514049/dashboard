import NavbarWrapper from "@/components/ui/NavbarWrapper";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Dashboard-App",
  description: "This is a dashboard app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavbarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
