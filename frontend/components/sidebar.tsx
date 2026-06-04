'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../lib/api';
import type { RootState } from '../store';
import { setSelectedCollegeId } from '../store/slices/authSlice';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/timetables', label: 'Timetables' },
  { href: '/absences', label: 'Absences' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/colleges', label: 'Colleges' },
  { href: '/directory', label: 'Directory' }
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const selectedCollegeId = useSelector((state: RootState) => state.auth.selectedCollegeId);
  const userCollegeId = useSelector((state: RootState) => state.auth.user?.collegeId);
  const [colleges, setColleges] = useState<Array<{ _id: string; name: string; code: string }>>([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/colleges');
      setColleges(response.data);
    };
    void load().catch(() => undefined);
  }, []);

  const activeCollegeId = selectedCollegeId ?? userCollegeId ?? '';
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('smartTimetableTheme');
    const nextTheme = stored === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.dataset.theme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.dataset.theme = nextTheme;
    window.localStorage.setItem('smartTimetableTheme', nextTheme);
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Image src="/assets/college-logo.jpeg" alt="Shri Siddheshwar Women's College of Engineering, Solapur logo" fill sizes="48px" />
        </div>
        <div>
          <h1>Smart Timetable</h1>
          <p>Multi-college live orchestration</p>
        </div>
      </div>
      <button className="button secondary" type="button" onClick={toggleTheme} style={{ width: '100%', marginBottom: 18 }}>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="field">
          <label>College</label>
          <select
            value={activeCollegeId}
            onChange={(event) => dispatch(setSelectedCollegeId(event.target.value || null))}
          >
            <option value="">Select college</option>
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.code} - {college.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <nav className="nav">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
