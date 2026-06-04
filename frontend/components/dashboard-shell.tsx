import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
