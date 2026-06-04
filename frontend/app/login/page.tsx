'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../../lib/api';
import { setCredentials } from '../../store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@institution.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
      router.push('/dashboard');
    } catch (err) {
      setError('Unable to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card form" onSubmit={onSubmit}>
        <div className="home-brand home-brand-login">
          <div className="brand-mark brand-mark-lg">
            <Image src="/assets/college-logo.jpeg" alt="Shri Siddheshwar Women's College of Engineering, Solapur logo" fill sizes="96px" />
          </div>
          <div>
            <h1>Sign in</h1>
            <p className="muted">Use the demo credentials from the README or connect your own auth flow.</p>
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error ? <p className="badge danger">{error}</p> : null}
        <button className="button" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
