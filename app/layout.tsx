import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/sidebar';
import { Providers } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Content Studio',
  description: 'E-commerce AI Content Generation Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 md:ml-64">
              {children}
            </main>
          </div>
          <Toaster />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}