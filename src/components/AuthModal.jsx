import React, { useState } from 'react';
import { X, ShieldCheck, GraduationCap } from 'lucide-react';
import { HALLS, FACULTIES } from '../data/mockData';

export default function AuthModal({ isOpen, user, onClose, onLogin, onLogout }) {
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'arivera@campus.edu');
  const [studentId, setStudentId] = useState(user?.studentId || 'KC-2026-9012');
  const [hall, setHall] = useState(user?.hall || 'North Hall');
  const [faculty, setFaculty] = useState(user?.faculty || 'Engineering');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name, email, studentId, hall, faculty, verified: true });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={22} color="#0b462d" />
            <h2 style={{ margin: 0, fontSize: 20 }}>Student ID Verification</h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontWeight: 700, marginBottom: 4 }}>
                <ShieldCheck size={16} /> Verified Campus Account
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{user.email} • ID: {user.studentId}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{user.hall} • {user.faculty}</div>
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Sign in with your student email (.edu) and Student ID to unlock verified campus checkout, chat, and selling.
            </p>
            <input
              required
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <input
              required
              type="email"
              placeholder="Student Email (e.g. name@campus.edu)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <input
              required
              type="text"
              placeholder="Student ID Number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <select
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                {HALLS.filter((h) => h !== 'All Halls').map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                {FACULTIES.filter((f) => f !== 'All Faculties').map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary">
              Verify &amp; Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
