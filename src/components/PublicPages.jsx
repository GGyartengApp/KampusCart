import React, { useState } from 'react';
import { ShieldCheck, MapPin, CheckCircle2, ChevronDown } from 'lucide-react';
import { FAQS, SAFE_MEETUP_POINTS } from '../data/mockData';

export default function PublicPages({ onNotify }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [legalTab, setLegalTab] = useState('safety');
  const [contactMsg, setContactMsg] = useState('');

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64, display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* About & How It Works */}
      <section>
        <h1 className="section-title" style={{ marginBottom: 10 }}>About KampusCart &amp; How It Works</h1>
        <p style={{ color: '#475569', fontSize: 15, maxWidth: 720, lineHeight: 1.6 }}>
          KampusCart is a mobile-first marketplace built to connect verified student entrepreneurs with buyers across campus halls and faculties — fast, lightweight, and protected by campus escrow.
        </p>

        <div className="collection-grid" style={{ marginTop: 22 }}>
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 22, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#18181b', fontSize: 13 }}>STEP 01</strong>
            <h3 style={{ margin: '8px 0 6px' }}>Verify Your Student ID</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Sign up with your .edu email and Student ID. Only verified students can sell on KampusCart.
            </p>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 22, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#18181b', fontSize: 13 }}>STEP 02</strong>
            <h3 style={{ margin: '8px 0 6px' }}>Browse or Open a Free Store</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Filter by Hall, Faculty, Price, or Delivery Option. Sellers list for free with zero monthly fees.
            </p>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 22, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#18181b', fontSize: 13 }}>STEP 03</strong>
            <h3 style={{ margin: '8px 0 6px' }}>Safe Meet-up &amp; Escrow Release</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Meet at staffed Safe Campus Points. Payouts release after the buyer confirms receipt.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing & Fees */}
      <section style={{ background: '#1c1a18', color: '#ffffff', borderRadius: 22, padding: 32 }}>
        <h2 style={{ margin: '0 0 8px' }}>Transparent Pricing &amp; Fees</h2>
        <p style={{ margin: '0 0 20px', opacity: 0.85, fontSize: 14 }}>
          Built for student hustlers — you only pay when you make a completed sale.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fde047' }}>GH₵0</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Storefront &amp; Listing Fee</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Free to list unlimited products and services.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#4ade80' }}>5%</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Completed Order Commission</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Small commission charged only on completed orders.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fb923c' }}>100%</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Buyer Escrow Protection</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Zero extra fees for Mobile Money, Card, or Pay on Delivery.</div>
          </div>
        </div>
      </section>

      {/* Safe Campus Meet-up Points & Legal/Safety Guidelines */}
      <section>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { id: 'safety', label: 'Safety Guidelines & Meet-up Points' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'privacy', label: 'Privacy Policy' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn-sm ${legalTab === t.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setLegalTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {legalTab === 'safety' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {SAFE_MEETUP_POINTS.map((mp) => (
              <div key={mp.id} style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#18181b' }}>
                  <MapPin size={16} /> {mp.name}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{mp.hours}</div>
                <div style={{ fontSize: 12, color: '#047857', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={13} /> {mp.security}
                </div>
              </div>
            ))}
          </div>
        )}

        {legalTab === 'terms' && (
          <div style={{ padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
            <strong>KampusCart Terms:</strong> All sellers must maintain active student enrollment and valid Student ID. Prohibited items (weapons, academic dishonesty/cheating services, controlled substances) are strictly banned and removed by Admin moderation. Payouts are released upon buyer receipt confirmation or after 48 hours if no dispute is filed.
          </div>
        )}

        {legalTab === 'privacy' && (
          <div style={{ padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
            <strong>Privacy Policy:</strong> Your .edu email and Student ID are used solely for campus verification and trust badges. Personal phone numbers and dorm room numbers are never shared publicly; buyers and sellers coordinate via in-app chat and Safe Campus Meet-up Points.
          </div>
        )}
      </section>

      {/* FAQ & Contact */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
        <div>
          <h2 style={{ margin: '0 0 14px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, idx) => (
              <div key={faq.q} style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#f8fafc',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: 'left',
                  }}
                >
                  {faq.q}
                  <ChevronDown size={16} />
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '12px 16px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNotify('Support ticket sent to Campus Cart team!');
            setContactMsg('');
          }}
          style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, height: 'fit-content' }}
        >
          <h2 style={{ margin: 0 }}>Contact Campus Support</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            Questions about an order, verification, or brand partnership? Reach our student team.
          </p>
          <input
            required
            type="email"
            placeholder="Your .edu email"
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
          <textarea
            required
            rows={3}
            placeholder="How can we help?"
            value={contactMsg}
            onChange={(e) => setContactMsg(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
          <button type="submit" className="btn-primary">
            <CheckCircle2 size={15} /> Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
