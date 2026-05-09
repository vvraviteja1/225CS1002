// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Placements, Results and Events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, backgroundColor: "#f9f9f9" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}