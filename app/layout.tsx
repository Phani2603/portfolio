import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phani Srikar | Next.js Developer & Full Stack Engineer",
  description:
    "Engineering Intelligent Web Platforms from Idea to Deployment. Passionate Next.js Developer based in India, specializing in React, TypeScript, and modern web technologies. Creator of AlgoViz, Aura IoT Ecosystem, and innovative web applications.",
  keywords: [
    "Phani Srikar",
    "Next.js Developer",
    "Full Stack Engineer",
    "React Developer",
    "TypeScript",
    "Algorithm Visualizer",
    "IoT Developer",
    "Web Development India",
    "AlgoViz",
    "Aura Smart Home",
    "Sinema",
    "Vibeyy",
    "Dynamic Web Magic",
    "JavaScript Animation Library",
  ],
  authors: [{ name: "Phani Srikar", url: "https://github.com/Phani2603" }],
  creator: "Phani Srikar",
  publisher: "Phani Srikar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://phanis-dev-portfolio.vercel.app", // Replace with your actual domain
    title: "Phani Srikar | Next.js Developer & Full Stack Engineer",
    description:
      "Engineering Intelligent Web Platforms from Idea to Deployment. Creator of AlgoViz Algorithm Visualizer, Aura IoT Ecosystem, and cutting-edge web applications using React, Next.js, and TypeScript.",
    siteName: "Phani Srikar Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Phani Srikar - Next.js Developer & Full Stack Engineer Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phani Srikar | Next.js Developer & Full Stack Engineer",
    description:
      "Engineering Intelligent Web Platforms from Idea to Deployment. Creator of AlgoViz, Aura IoT Ecosystem, and innovative web applications.",
    creator: "@vegeta30451", // Your Twitter handle
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/android-chrome-512x512.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://phanis-dev-portfolio.vercel.app", // Replace with your actual domain
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark light",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
