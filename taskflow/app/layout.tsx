import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { TaskProvider } from '@/lib/task-store';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TaskFlow – Productivity Dashboard',
  description: 'Modern task management and productivity dashboard built with Next.js 14',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TaskProvider>
            <TooltipProvider>
              <div className="relative min-h-screen bg-background bg-gradient-mesh">
                <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                  <div className="flex h-full flex-col glass-sidebar border-r border-white/10">
                    <Sidebar />
                  </div>
                </div>
                <div className="md:pl-64 flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 p-4 md:p-6 scrollbar-thin overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'rgba(15,12,30,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    backdropFilter: 'blur(12px)',
                  },
                }}
              />
            </TooltipProvider>
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
