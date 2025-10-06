/*
 * Root layout for the application.  Defines HTML metadata and sets
 * global styles on the body element.  This layout wraps all pages
 * under the app/ directory.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Business Assessment Tool - DeVOTE',
  description:
    'Professional assessment tool to analyze your business needs and provide actionable insights.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-sans antialiased bg-zinc-900 text-zinc-200">
        {children}
      </body>
    </html>
  );
}