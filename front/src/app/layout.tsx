import './globals.css';
import { Changa, Lato } from 'next/font/google';
import React from 'react';
import { Toaster } from 'react-hot-toast';
const changa = Changa({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-changa',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${changa.className}`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
