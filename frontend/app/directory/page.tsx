'use client';

import { DashboardShell } from '../../components/dashboard-shell';
import { SchedulerWorkspace } from '../../components/scheduler-workspace';

export default function DirectoryPage() {
  return (
    <DashboardShell>
      <SchedulerWorkspace defaultStep={1} />
    </DashboardShell>
  );
}

