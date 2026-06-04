'use client';

import { DashboardShell } from '../../components/dashboard-shell';
import { SchedulerWorkspace } from '../../components/scheduler-workspace';

export default function TimetablesPage() {
  return (
    <DashboardShell>
      <SchedulerWorkspace defaultStep={0} />
    </DashboardShell>
  );
}

