import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="login-page">
      <div className="card login-card">
        <div className="home-brand">
          <div className="brand-mark brand-mark-lg">
            <Image src="/assets/college-logo.jpeg" alt="Shri Siddheshwar Women's College of Engineering, Solapur logo" fill sizes="96px" />
          </div>
          <div>
            <h1>Smart Timetable Management System</h1>
            <p className="muted">Built for academic planning, branch-wise scheduling, and live timetable orchestration.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
          <Link className="button" href="/login">
            Sign in
          </Link>
          <Link className="button secondary" href="/dashboard">
            Open dashboard
          </Link>
          <Link className="button secondary" href="/timetables">
            Build timetable
          </Link>
        </div>
      </div>
    </div>
  );
}
