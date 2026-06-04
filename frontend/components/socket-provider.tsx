'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../lib/socket';
import { upsertTimetableEntry } from '../store/slices/timetableSlice';
import { pushNotification } from '../store/slices/notificationSlice';
import type { RootState } from '../store';

export function SocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const collegeId = useSelector((state: RootState) => state.auth.selectedCollegeId ?? state.auth.user?.collegeId);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('connect', () => {
      if (collegeId) socket.emit('join:college', collegeId);
    });

    socket.on('timetable:update', (entry) => {
      if (entry?._id) dispatch(upsertTimetableEntry(entry));
    });

    socket.on('notification:new', (notification) => {
      dispatch(pushNotification(notification));
    });

    return () => {
      socket.off('connect');
      socket.off('timetable:update');
      socket.off('notification:new');
    };
  }, [collegeId, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (collegeId && socket.connected) {
      socket.emit('join:college', collegeId);
    }
  }, [collegeId]);

  return <>{children}</>;
}
