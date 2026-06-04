'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '../../components/dashboard-shell';
import { api } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function AnalyticsPage() {
  const selectedCollegeId = useSelector((state: RootState) => state.auth.selectedCollegeId ?? state.auth.user?.collegeId);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/analytics/dashboard', { params: { collegeId: selectedCollegeId } });
      setAnalytics(response.data);
    };
    void load().catch(() => undefined);
  }, [selectedCollegeId]);

  return (
    <DashboardShell>
      <div className="topbar hero">
        <div>
          <h2>Dashboard & Analytics</h2>
          <p>Faculty workload, classroom utilization, timetable conflicts, and attendance impact reports.</p>
        </div>
      </div>

      {analytics ? (
        <div className="grid cards">
          <div className="card">
            <h3>Total Lectures</h3>
            <div className="value">{analytics.totalLectures}</div>
          </div>
          <div className="card">
            <h3>Practical Sessions</h3>
            <div className="value">{analytics.practicalCount}</div>
          </div>
          <div className="card">
            <h3>Conflict Count</h3>
            <div className="value">{analytics.conflictCount}</div>
          </div>
          <div className="card">
            <h3>Active Absences</h3>
            <div className="value">{analytics.activeAbsences}</div>
          </div>
          <div className="card">
            <h3>On Leave</h3>
            <div className="value">{analytics.onLeaveCount}</div>
          </div>
          <div className="card">
            <h3>Faculty Load</h3>
            <div className="list">
              {analytics.facultyLoad.map((item: any) => (
                <div className="list-item" key={item.facultyId}>
                  <span>{item.facultyName}</span>
                  <span className="badge primary">{item.loadRatio}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">Loading analytics...</div>
      )}
    </DashboardShell>
  );
}
