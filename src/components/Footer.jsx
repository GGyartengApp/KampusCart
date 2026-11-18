import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigate, onBrowseCategory }) {
  return (
    <footer style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc', padding: '44px 0 28px', marginTop: 20 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div className="brand-icon" style={{ width: 32, height: 32, fontSize: 13 }}>KC</div>
              <strong style={{ fontSize: 18, color: '#0b462d' }}>KampusCart</strong>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: '0 0 12px' }}>
              Mobile-first campus marketplace connecting verified student entrepreneurs to buyers across every hall.
            </p>
            <span className="verified-badge">
              <ShieldCheck size={12} /> Verified Student Network
            </span>
          </div>

          <div>
            <strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>Categories</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#475569' }}>
              {['Food', 'Fashion', 'Tech', 'Services', 'Tutoring', 'Printing'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onBrowseCategory(cat)}
                  style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: 'inherit' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>Platform</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#475569' }}>
              <button type="button" onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: 'inherit' }}>
                About &amp; How It Works
              </button>
              <button type="button" onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: 'inherit' }}>
                Pricing &amp; 5% Commission
              </button>
              <button type="button" onClick={() => onNavigate('seller')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: 'inherit' }}>
                Start Selling
              </button>
              <button type="button" onClick={() => onNavigate('admin')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: 'inherit' }}>
                Admin Panel
              </button>
            </div>
          </div>

          <div>
            <strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>Trust &amp; Payments</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['MoMo', 'Visa / Card', 'Pay on Delivery', 'Escrow'].map((badge) => (
                <span
                  key={badge}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#334155',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, color: '#64748b' }}>
          <span>© 2026 KampusCart. Built for Student Entrepreneurs.</span>
          <span>Terms • Privacy Policy • Safe Campus Meet-up Guidelines</span>
        </div>
      </div>
    </footer>
  );
}
