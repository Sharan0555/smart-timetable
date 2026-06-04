'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { DashboardShell } from '../../components/dashboard-shell';
import { api } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function AbsencesPage() {
  const selectedCollegeId = useSelector((state: RootState) => state.auth.selectedCollegeId ?? state.auth.user?.collegeId);
  const [facultyId, setFacultyId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedCollegeId) {
      setMessage('Please select a college first.');
      return;
    }
    try {
      const response = await api.post('/absences/mark', {
        collegeId: selectedCollegeId,
        facultyId,
        date,
        reason
      });
      setMessage(`Absence recorded. ${response.data.processedLectures.length} lectures evaluated for reassignment.`);
    } catch {
      setMessage('Unable to mark absence at this time.');
    }
  };

  return (
    <DashboardShell>
      <div className="topbar hero">
        <div>
          <h2>Absence Management</h2>
          <p>Mark a faculty member absent and trigger automatic timetable adjustment in real time.</p>
        </div>
      </div>

      <form className="card form" onSubmit={onSubmit}>
        <div className="field">
          <label>Faculty ID</label>
          <input value={facultyId} onChange={(e) => setFacultyId(e.target.value)} placeholder="Enter faculty Mongo ID" />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
        </div>
        <button className="button" type="submit">
          Mark Absent
        </button>
        {message ? <p className="badge primary">{message}</p> : null}
      </form>
    </DashboardShell>
  );
}
