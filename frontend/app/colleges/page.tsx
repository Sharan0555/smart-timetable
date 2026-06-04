'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardShell } from '../../components/dashboard-shell';
import { api } from '../../lib/api';
import type { RootState } from '../../store';
import { setSelectedCollegeId } from '../../store/slices/authSlice';

type College = {
  _id: string;
  name: string;
  code: string;
  address?: string;
  timezone?: string;
  divisions?: string[];
};

export default function CollegesPage() {
  const dispatch = useDispatch();
  const selectedCollegeId = useSelector((state: RootState) => state.auth.selectedCollegeId ?? state.auth.user?.collegeId);
  const [colleges, setColleges] = useState<College[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [divisions, setDivisions] = useState('CSE, Mechanical, Civil, Electronic');
  const [error, setError] = useState('');

  const load = async () => {
    const response = await api.get('/colleges');
    setColleges(response.data);
  };

  useEffect(() => {
    void load().catch(() => undefined);
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsedDivisions = divisions
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (!parsedDivisions.length) {
      setError('Please add at least one division.');
      return;
    }
    setError('');
    await api.post('/colleges', { name, code, address, timezone, divisions: parsedDivisions });
    setName('');
    setCode('');
    setAddress('');
    setTimezone('Asia/Kolkata');
    setDivisions('CSE, Mechanical, Civil, Electronic');
    await load();
  };

  const removeCollege = async (id: string) => {
    await api.delete(`/colleges/${id}`);
    if (selectedCollegeId === id) {
      dispatch(setSelectedCollegeId(null));
    }
    await load();
  };

  return (
    <DashboardShell>
      <div className="topbar hero">
        <div>
          <h2>Colleges</h2>
          <p>Switch between colleges and manage each institution independently.</p>
        </div>
      </div>

      <div className="grid cards">
        <form className="card form" onSubmit={onSubmit}>
          <h3>Create college</h3>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="field">
            <label>Code</label>
            <input value={code} onChange={(event) => setCode(event.target.value)} />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
          <div className="field">
            <label>Timezone</label>
            <input value={timezone} onChange={(event) => setTimezone(event.target.value)} />
          </div>
          <div className="field">
            <label>Divisions</label>
            <textarea
              rows={3}
              value={divisions}
              onChange={(event) => setDivisions(event.target.value)}
              placeholder="CSE, Mechanical, Civil, Electronic"
            />
            <p className="muted">Separate each division with a comma.</p>
          </div>
          {error ? <p className="badge danger">{error}</p> : null}
          <button className="button" type="submit">
            Add College
          </button>
        </form>

        <div className="card">
          <h3>Managed colleges</h3>
          <div className="list">
            {colleges.map((college) => (
              <div className="list-item" key={college._id}>
                <div>
                  <strong>
                    {college.code} - {college.name}
                  </strong>
                  <div className="muted">{college.address}</div>
                  <div className="chip-row" style={{ marginTop: 8 }}>
                    {(college.divisions ?? []).length ? (
                      college.divisions!.map((division) => (
                        <span key={division} className="badge primary">
                          {division}
                        </span>
                      ))
                    ) : (
                      <span className="muted">No divisions added</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="button secondary" type="button" onClick={() => dispatch(setSelectedCollegeId(college._id))}>
                    {selectedCollegeId === college._id ? 'Selected' : 'Switch'}
                  </button>
                  <button className="button secondary" type="button" onClick={() => void removeCollege(college._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
