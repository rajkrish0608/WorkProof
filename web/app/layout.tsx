import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Atmosphere } from "@/components/ui/atmosphere";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "WorkProof",
  description: "Daily Wage Payment Proof Ledger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <SmoothScroll>
          <Atmosphere />
          <AuthProvider>
            {children}
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
