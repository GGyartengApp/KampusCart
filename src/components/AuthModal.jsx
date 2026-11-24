import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  X,
} from 'lucide-react';
import { HALLS, FACULTIES } from '../data/mockData';

export default function AuthModal({
  isOpen,
  initialMode = 'signin',
  user,
  accounts = [],
  contextNotice = '',
  onClose,
  onSignIn,
  onSignUp,
  onLogout,
  onNavigate,
}) {
  const [mode, setMode] = useState(initialMode);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPw, setShowSignInPw] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [hall, setHall] = useState('North Hall');
  const [faculty, setFaculty] = useState('Engineering');
  const [accountRole, setAccountRole] = useState('buyer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPw, setShowSignUpPw] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const isSignUp = mode === 'signup';

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setError('');
    const normalized = signInEmail.trim().toLowerCase();
    const match = accounts.find((acc) => acc.email.toLowerCase() === normalized);
    if (!match || match.password !== signInPassword) {
      setError('Invalid student email or password. Try the Demo Sign In below or switch to Sign Up.');
      return;
    }
    onSignIn(match);
    onClose();
  };

  const handleDemoSignIn = () => {
    setError('');
    const demo = accounts[0] || {
      name: 'Alex Rivera',
      email: 'arivera@campus.edu',
      studentId: 'KC-2026-9012',
      hall: 'North Hall',
      faculty: 'Engineering',
      role: 'buyer',
      verified: true,
    };
    onSignIn(demo);
    onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError('');
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }
    if (accounts.some((acc) => acc.email.toLowerCase() === normalized)) {
      setError('An account with this email already exists. Please sign in instead.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    onSignUp({
      name: name.trim(),
      email: normalized,
      studentId: studentId.trim() || `KC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      hall,
      faculty,
      role: accountRole,
      password,
      verified: true,
    });
    onClose();
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Authentication">
      <div
        className={`auth-modal-shell${isSignUp ? ' auth-modal-shell--signup' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          <X size={18} />
        </button>

        {/* Picture / Visual Showcase Panel (Left in Sign In, slides to Right in Sign Up) */}
        <div className="auth-modal-panel auth-modal-picture">
          <img
            src={isSignUp ? '/images/auth/signup-shopping.jpg' : '/images/auth/signin-shopping.jpg'}
            alt="KampusCart Campus Showcase"
            className="auth-modal-picture-img"
            style={{ objectPosition: isSignUp ? 'center 22%' : 'center center' }}
          />
        </div>

        {/* Fields / Form Panel (Right in Sign In, slides to Left in Sign Up) */}
        <div className="auth-modal-panel auth-modal-fields">
          {contextNotice && !user && (
            <div
              style={{
                background: '#fefce8',
                border: '1px solid #fde047',
                color: '#854d0e',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              {contextNotice}
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GraduationCap size={24} color="#18181b" />
                <div>
                  <h2 style={{ margin: 0, fontSize: 20 }}>Verified Campus Account</h2>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                    Signed in and ready for campus checkout &amp; selling.
                  </p>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontWeight: 700, marginBottom: 4, fontSize: 12 }}>
                  <ShieldCheck size={15} /> Verified Student
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                  {user.email} • ID: {user.studentId}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                  {user.hall} • {user.faculty}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => {
                    onClose();
                    onNavigate('marketplace');
                  }}
                >
                  Browse Store <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onNavigate('seller');
                  }}
                >
                  <Store size={14} /> Seller Hub
                </button>
              </div>

              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                style={{ color: '#dc2626', borderColor: '#fecaca' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              {/* Sign In / Sign Up Switcher */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: '#f1f5f9',
                  padding: 4,
                  borderRadius: 12,
                  marginBottom: 18,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('signin');
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 9,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    background: !isSignUp ? '#ffffff' : 'transparent',
                    color: !isSignUp ? '#18181b' : '#64748b',
                    boxShadow: !isSignUp ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('signup');
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 9,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    background: isSignUp ? '#ffffff' : 'transparent',
                    color: isSignUp ? '#18181b' : '#64748b',
                    boxShadow: isSignUp ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                  }}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    borderRadius: 10,
                    padding: '9px 12px',
                    fontSize: 12,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </div>
              )}

              {!isSignUp ? (
                <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <h2 style={{ margin: '0 0 2px', fontSize: 20 }}>Welcome Back</h2>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                      Sign in with your student email and password.
                    </p>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    Student Email
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} color="#64748b" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        required
                        type="email"
                        placeholder="arivera@campus.edu"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 34px',
                          borderRadius: 10,
                          border: '1px solid #cbd5e1',
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    Password
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} color="#64748b" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        required
                        type={showSignInPw ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 36px 10px 34px',
                          borderRadius: 10,
                          border: '1px solid #cbd5e1',
                          fontSize: 13,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPw((s) => !s)}
                        aria-label={showSignInPw ? 'Hide password' : 'Show password'}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                        }}
                      >
                        {showSignInPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 2 }}>
                    Sign In <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={handleDemoSignIn}
                    style={{ width: '100%' }}
                  >
                    <GraduationCap size={15} /> Demo Student Sign In (Alex Rivera)
                  </button>

                  <p style={{ margin: '2px 0 0', textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                    New to KampusCart?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setMode('signup');
                      }}
                      style={{ background: 'none', border: 'none', color: '#18181b', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <h2 style={{ margin: '0 0 2px', fontSize: 20 }}>Create Account</h2>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                      Join verified students buying and selling on campus.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                      Full Name
                      <div style={{ position: 'relative' }}>
                        <User size={13} color="#64748b" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          required
                          type="text"
                          placeholder="Ama Mensah"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          style={{ width: '100%', padding: '9px 8px 9px 30px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                        />
                      </div>
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                      Student ID
                      <input
                        required
                        type="text"
                        placeholder="KC-2026-4812"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        style={{ width: '100%', padding: '9px 10px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                    </label>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                    Student Email
                    <input
                      required
                      type="email"
                      placeholder="name@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <select
                      value={hall}
                      onChange={(e) => setHall(e.target.value)}
                      style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                    >
                      {HALLS.filter((h) => h !== 'All Halls').map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                    >
                      {FACULTIES.filter((f) => f !== 'All Faculties').map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setAccountRole('buyer')}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 9,
                        border: accountRole === 'buyer' ? '2px solid #18181b' : '1px solid #cbd5e1',
                        background: accountRole === 'buyer' ? '#ecfdf5' : '#ffffff',
                        color: accountRole === 'buyer' ? '#18181b' : '#475569',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Campus Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountRole('seller')}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 9,
                        border: accountRole === 'seller' ? '2px solid #18181b' : '1px solid #cbd5e1',
                        background: accountRole === 'seller' ? '#ecfdf5' : '#ffffff',
                        color: accountRole === 'seller' ? '#18181b' : '#475569',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Student Seller
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        required
                        type={showSignUpPw ? 'text' : 'password'}
                        placeholder="Password (6+ chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '9px 30px 9px 10px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPw((s) => !s)}
                        aria-label={showSignUpPw ? 'Hide password' : 'Show password'}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                        }}
                      >
                        {showSignUpPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <input
                      required
                      type={showSignUpPw ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: 9, border: '1px solid #cbd5e1', fontSize: 12 }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 2 }}>
                    Create Campus Account <ArrowRight size={15} />
                  </button>

                  <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setMode('signin');
                      }}
                      style={{ background: 'none', border: 'none', color: '#18181b', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
