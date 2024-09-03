import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import StudentLayout from "./studentLayout"; // Import the ClientLayout component

const inter = Libre_Baskerville({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Book Issue Hub",
  description: "Use this platform to issue books from the library",
  icons: {
    shortcut: {
      url: "/favicon.ico",
      type: "image/x-icon",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StudentLayout>{children}</StudentLayout>
      </body>
    </html>
  );
}
