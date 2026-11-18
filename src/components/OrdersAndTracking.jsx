import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, AlertTriangle, Star, Package } from 'lucide-react';
import ProductIllustration from './ProductIllustration';

const STEPS = ['Placed', 'Accepted', 'Preparing', 'Delivering', 'Completed'];

export default function OrdersAndTracking({
  orders,
  sellers,
  onConfirmReceipt,
  onLeaveReview,
  onOpenDispute,
  onOpenChat,
}) {
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');

  const getSeller = (id) => sellers.find((s) => s.id === id) || sellers[0];

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div>
          <h1 className="section-title">Your Campus Orders &amp; Tracking</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Track live seller progress, confirm receipt to release escrow payouts, or rate completed orders.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#f8fafc', borderRadius: 18 }}>
          <Package size={42} color="#94a3b8" />
          <h3>No orders yet</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>Browse the marketplace to place your first campus order!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((order) => {
            const stepIdx = STEPS.indexOf(order.status);
            const firstItem = order.items[0];
            const seller = getSeller(firstItem?.sellerId);

            return (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 18,
                  padding: 20,
                  background: '#ffffff',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.03)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <strong style={{ fontSize: 16 }}>Order #{order.id}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {order.date} • {order.paymentMethod} • Meet-up: <strong>{order.meetupPoint}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        background: order.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                        color: order.status === 'Completed' ? '#166534' : '#92400e',
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {order.status}
                    </span>
                    <strong style={{ fontSize: 16, color: '#0b462d' }}>${order.total.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Live 5-Step Progress Stepper */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, margin: '18px 0' }}>
                  {STEPS.map((step, idx) => {
                    const done = idx <= stepIdx;
                    return (
                      <div key={step} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            height: 6,
                            borderRadius: 999,
                            background: done ? '#0b462d' : '#e2e8f0',
                            marginBottom: 6,
                          }}
                        />
                        <span style={{ fontSize: 11, fontWeight: done ? 700 : 500, color: done ? '#0b462d' : '#94a3b8' }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 10, background: '#f7f7f7', display: 'grid', placeItems: 'center' }}>
                          <ProductIllustration art={item.art} color={item.color} size={36} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            {item.colorName} × {item.qty} • Sold by {seller?.name}
                          </div>
                        </div>
                      </div>
                      <strong>${(item.price * item.qty).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                  {!order.receiptConfirmed && (
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() => onConfirmReceipt(order.id)}
                    >
                      <CheckCircle2 size={14} /> Confirm Receipt (Release Payout)
                    </button>
                  )}

                  {order.status === 'Completed' && (
                    <button
                      type="button"
                      className="btn-orange btn-sm"
                      onClick={() => setReviewOrder(order)}
                    >
                      <Star size={14} /> Rate &amp; Review
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => onOpenChat(seller, null)}
                  >
                    <MessageCircle size={14} /> Chat Seller
                  </button>

                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                    onClick={() => setDisputeOrder(order)}
                  >
                    <AlertTriangle size={14} /> Report / Dispute
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave Review Modal */}
      {reviewOrder && (
        <div className="modal-backdrop" onClick={() => setReviewOrder(null)}>
          <div className="modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px' }}>Rate Order #{reviewOrder.id}</h3>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  style={{ background: 'none', border: 'none', fontSize: 24, color: n <= rating ? '#f59e0b' : '#cbd5e1' }}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Share how the meet-up and item quality were..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline btn-sm" onClick={() => setReviewOrder(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => {
                  onLeaveReview(reviewOrder.items[0].productId, rating, comment || 'Great campus transaction!');
                  setComment('');
                  setReviewOrder(null);
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Dispute Modal */}
      {disputeOrder && (
        <div className="modal-backdrop" onClick={() => setDisputeOrder(null)}>
          <div className="modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Open Dispute for #{disputeOrder.id}</h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
              Our Campus Cart Admin team will review and hold escrow until resolved.
            </p>
            <textarea
              rows={3}
              placeholder="Describe the issue (item not as described, no-show at meet-up, etc.)..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline btn-sm" onClick={() => setDisputeOrder(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ background: '#dc2626' }}
                onClick={() => {
                  if (disputeReason.trim()) {
                    onOpenDispute(disputeOrder, disputeReason.trim());
                    setDisputeReason('');
                    setDisputeOrder(null);
                  }
                }}
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
