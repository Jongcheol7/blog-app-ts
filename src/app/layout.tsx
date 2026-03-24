import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SessionProvider from "@/components/common/SessionProvider";
import ReactQueryProvider from "@/components/common/ReactQueryProvider";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import Header from "@/modules/common/Header";
import CategoryNav from "@/modules/Category/CategoryNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jongcheol Lee — Blog",
  description: "Developer blog by Jongcheol Lee",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh]`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <ReactQueryProvider>
              <div className="max-w-6xl px-5 sm:px-8 lg:px-10 mx-auto">
                <Header />
                <CategoryNav />
                <main className="animate-fade-in pb-24">{children}</main>
              </div>
              <Toaster position="bottom-center" richColors />
            </ReactQueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
