import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { QueryProvider } from "@/components/layout/query-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor Tracker",
  description: "Doctor and patient tracking dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-0 flex-col overflow-hidden font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow focus:ring-3 focus:ring-ring/50"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <QueryProvider>
            <div
              id="main-content"
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              tabIndex={-1}
            >
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
