import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import { DataProvider } from "@/context/dataContext";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-inter" 
});

export const metadata = {
  title: "Ustaz Dashboard - Islamic Academy",
  description: "Teacher portal for Islamic Academy",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Base styles mapped straight from the HTML */}
      <body className="bg-background text-on-surface font-body-md antialiased min-h-screen">
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}