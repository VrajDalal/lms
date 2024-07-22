import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Issue Hub",
  description: "use this platform for issue the books from library",
  icons: {
    shortcut: {
      url: '/favicon.ico',
      type: 'image/x-icon'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}, font-serif`}>
        <Toaster position="bottom-center" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
