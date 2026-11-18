import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { HALLS, SAFE_MEETUP_POINTS } from '../data/mockData';
import ProductIllustration from './ProductIllustration';

export default function CheckoutModal({
  isOpen,
  items,
  promoCodes,
  user,
  onClose,
  onPlaceOrder,
  onGoToOrders,
}) {
  const [returningStudent, setReturningStudent] = useState(false);
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerHall, setBuyerHall] = useState(user?.hall || 'North Hall');
  const [meetupPoint, setMeetupPoint] = useState(SAFE_MEETUP_POINTS[0].name);
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money (MoMo)');
  const [couponInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleToggleReturning = (checked) => {
    setReturningStudent(checked);
    if (checked) {
      setBuyerName(user?.name || 'Alex Rivera');
      setBuyerEmail(user?.email || 'arivera@campus.edu');
      setBuyerHall('North Hall');
      setPhone('+233 24 555 0144');
    }
  };

  const handleApplyCoupon = () => {
    const found = promoCodes.find(
      (p) => p.active && p.code.toUpperCase() === couponInput.trim().toUpperCase()
    );
    if (found) {
      setAppliedPromo(found);
      setPromoError('');
    } else {
      setAppliedPromo(null);
      setPromoError('Invalid or expired promo code. Try CAMPUS25 or STUDENT10.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = onPlaceOrder({
      buyerName: buyerName || 'Campus Student',
      buyerEmail: buyerEmail || 'student@campus.edu',
      buyerHall,
      meetupPoint,
      paymentMethod,
      items,
      subtotal,
      discount,
      total,
    });
    setConfirmedOrder(order);
  };

  if (confirmedOrder) {
    return (
      <div className="modal-backdrop">
        <div className="modal-card" style={{ maxWidth: 460, textAlign: 'center', padding: 36 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 18px',
            }}
          >
            <CheckCircle2 size={42} />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 24 }}>Your order has been accepted</h2>
          <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b' }}>
            Transaction ID: <strong>{confirmedOrder.id}</strong>
          </p>
          <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
            Meet-up: <strong>{confirmedOrder.meetupPoint}</strong> • {confirmedOrder.paymentMethod}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-orange"
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
                onGoToOrders();
              }}
            >
              Track Order
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Campus Checkout</h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'grid', placeItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          {/* Left: Review Items & Delivery / Safe Meet-up Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Review Item And Meet-up</h3>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.colorName}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: '#f7f7f7', display: 'grid', placeItems: 'center' }}>
                      <ProductIllustration art={item.art} color={item.color} size={38} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {item.colorName} • Qty: {item.qty}
                      </div>
                    </div>
                  </div>
                  <strong>${(item.price * item.qty).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={returningStudent}
                onChange={(e) => handleToggleReturning(e.target.checked)}
              />
              Returning Student? (Auto-fill campus details)
            </label>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Delivery &amp; Safe Meet-up Information</h3>
              <input
                required
                type="text"
                placeholder="Full Name*"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
              <input
                required
                type="email"
                placeholder="Student Email (.edu)*"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select
                  value={buyerHall}
                  onChange={(e) => setBuyerHall(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  {HALLS.filter((h) => h !== 'All Halls').map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <input
                  required
                  type="tel"
                  placeholder="Mobile Number*"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#0b462d' }}>
                  Safe Campus Meet-up Point
                </label>
                <select
                  value={meetupPoint}
                  onChange={(e) => setMeetupPoint(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                >
                  {SAFE_MEETUP_POINTS.map((mp) => (
                    <option key={mp.id} value={mp.name}>
                      {mp.name} ({mp.hours})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right: Order Summary, Coupon & Payment Details (Shopcart video 00:20) */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Order Summary</h3>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Enter Coupon Code (CAMPUS25)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{ flex: 1, padding: '9px 12px', borderRadius: 999, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
              <button type="button" className="btn-primary btn-sm" onClick={handleApplyCoupon}>
                Apply Coupon
              </button>
            </div>
            {promoError && <div style={{ fontSize: 12, color: '#dc2626' }}>{promoError}</div>}
            {appliedPromo && (
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                Applied {appliedPromo.code}: {appliedPromo.discountPercent}% off!
              </div>
            )}

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Payment Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Mobile Money (MoMo)', 'Credit or Debit Card', 'Pay on Delivery'].map((method) => (
                  <label
                    key={method}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: paymentMethod === method ? '1.5px solid #0b462d' : '1px solid #e2e8f0',
                      background: paymentMethod === method ? '#ecfdf5' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <strong>{method}</strong>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Sub Total</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Buyer Escrow Protection</span>
                <strong style={{ color: '#16a34a' }}>Free</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Coupon Discount</span>
                <strong style={{ color: '#16a34a' }}>−${discount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                <strong>Total</strong>
                <strong style={{ color: '#0b462d' }}>${total.toFixed(2)}</strong>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Pay ${total.toFixed(2)}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="#0b462d" />
              Payouts are held safely until you confirm receipt.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
