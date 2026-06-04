'use client';

import { useEffect } from 'react';
import { DashboardShell } from '../../components/dashboard-shell';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { api } from '../../lib/api';
import { setNotifications } from '../../store/slices/notificationSlice';

export default function NotificationsPage() {
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const selectedCollegeId = useSelector((state: RootState) => state.auth.selectedCollegeId ?? state.auth.user?.collegeId);
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/notifications', { params: { collegeId: selectedCollegeId } });
      dispatch(setNotifications(response.data));
    };
    void load().catch(() => undefined);
  }, [dispatch, selectedCollegeId]);

  return (
    <DashboardShell>
      <div className="topbar hero">
        <div>
          <h2>Notifications</h2>
          <p>Instant history of timetable changes, absence events, and conflict warnings.</p>
        </div>
      </div>

      <div className="list">
        {notifications.length ? (
          notifications.map((item, index) => (
            <div className="card" key={item._id ?? `${item.title}-${index}`}>
              <div className="list-item" style={{ border: 0, padding: 0, background: 'transparent' }}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">{item.message}</p>
                </div>
                <span className={`badge ${item.type === 'error' ? 'danger' : item.type === 'warning' ? 'warning' : 'primary'}`}>
                  {item.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="card">No notifications yet.</div>
        )}
      </div>
    </DashboardShell>
  );
}
