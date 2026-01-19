import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NATAK.IO",
  description: "Next.js migration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#ccff00' },
        elements: {
          footer: "hidden",
        }
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
