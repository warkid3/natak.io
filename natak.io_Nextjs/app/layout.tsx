import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <AppSidebar />
            <main className="flex-1 overflow-hidden relative">
              <div className="p-2">
                <SidebarTrigger className="text-white" />
              </div>
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
