'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardShell } from '../../components/dashboard-shell';
import { StatCard } from '../../components/stat-card';
import { api } from '../../lib/api';
import { setTimetable } from '../../store/slices/timetableSlice';
import { setNotifications } from '../../store/slices/notificationSlice';
import type { RootState } from '../../store';
import { LiveTimetable } from '../../components/live-timetable';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.timetable.entries);
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedCollegeId = useSelector((state: RootState) => state.auth.selectedCollegeId ?? state.auth.user?.collegeId);

  useEffect(() => {
    const load = async () => {
      const [timetableRes, notificationRes] = await Promise.all([
        api.get('/timetables', { params: { collegeId: selectedCollegeId } }),
        api.get('/notifications', { params: { collegeId: selectedCollegeId } })
      ]);
      dispatch(setTimetable(timetableRes.data));
      dispatch(setNotifications(notificationRes.data));
    };
    void load().catch(() => undefined);
  }, [dispatch, selectedCollegeId]);

  return (
    <DashboardShell>
      <div className="topbar hero">
        <div>
          <h2>Welcome back, {user?.name ?? 'User'}</h2>
          <p>
            Live updates, conflict detection, absence handling, and automatic faculty replacement are running in the background.
          </p>
        </div>
        <span className="badge success">Realtime sync active</span>
      </div>

      <div className="grid cards">
        <StatCard title="Scheduled Lectures" value={entries.length} subtitle="All visible timetable entries" />
        <StatCard title="Notifications" value={notifications.length} subtitle="Change history and alerts" />
        <StatCard title="College Scope" value={selectedCollegeId ? 'Connected' : 'Demo'} subtitle="Multi-college aware session" />
      </div>

      <section className="section">
        <h3>Current Week Timetable</h3>
        <LiveTimetable entries={entries} />
      </section>
    </DashboardShell>
  );
}
