'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { setCredentials, setSelectedCollegeId } from '../store/slices/authSlice';
import { SocketProvider } from './socket-provider';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const raw = window.localStorage.getItem('smartTimetableAuth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { token: string; user: unknown; selectedCollegeId?: string | null };
        store.dispatch(setCredentials(parsed as any));
        if (parsed.selectedCollegeId) {
          store.dispatch(setSelectedCollegeId(parsed.selectedCollegeId));
        }
      } catch {
        window.localStorage.removeItem('smartTimetableAuth');
      }
    }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.auth.token && state.auth.user) {
        window.localStorage.setItem(
          'smartTimetableAuth',
          JSON.stringify({ token: state.auth.token, user: state.auth.user, selectedCollegeId: state.auth.selectedCollegeId })
        );
      } else {
        window.localStorage.removeItem('smartTimetableAuth');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <SocketProvider>{children}</SocketProvider>
    </Provider>
  );
}
