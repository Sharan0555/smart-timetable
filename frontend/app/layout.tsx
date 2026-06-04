import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '../components/providers';

export const metadata = {
  title: 'Smart Timetable Management System',
  description: 'Multi-college real-time timetable orchestration with automated absence handling.',
  icons: {
    icon: '/assets/college-logo.jpeg'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
