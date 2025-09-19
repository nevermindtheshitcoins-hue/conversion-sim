import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeVOTE Control Panel',
  description: 'A minimal interface for interacting with Gemini.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-zinc-900 text-zinc-200">
        {children}
      </body>
    </html>
  );
}
