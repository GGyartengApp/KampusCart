import React, { useState } from 'react';
import { ShieldCheck, Check, X, AlertTriangle, TrendingUp, Megaphone, Star } from 'lucide-react';

export default function AdminPanel({
  sellers,
  pendingSellers,
  products,
  orders,
  disputes,
  reviews,
  partnerships,
  onApproveSeller,
  onRejectSeller,
  onApproveListing,
  onResolveDispute,
  onToggleReviewVisibility,
  onTogglePartnership,
}) {
  const [tab, setTab] = useState('approvals');

  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const totalCommissions = completedOrders.reduce((s, o) => s + (o.commissionFee || o.total * 0.05), 0);
  const avgRating =
    products.length > 0
      ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(2)
      : '4.85';
  const disputeRate =
    orders.length > 0 ? ((disputes.length / Math.max(orders.length, 10)) * 100).toFixed(1) : '0.0';

  const pendingProducts = products.filter((p) => p.status !== 'approved');

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div>
          <h1 className="section-title">KampusCart Admin Panel</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Approve student sellers &amp; listings, moderate reviews, resolve disputes, and track 5% commissions.
          </p>
        </div>
      </div>

      {/* Success Measures KPIs (Section 9 of PDF) */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Verified Sellers Onboarded</span>
            <ShieldCheck size={16} color="#18181b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{sellers.length}</div>
          <div style={{ fontSize: 11, color: '#d97706', marginTop: 4 }}>{pendingSellers.length} pending verification</div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Commissions Earned (5%)</span>
            <TrendingUp size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: '#18181b' }}>
            GH₵{totalCommissions.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{completedOrders.length} completed orders</div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Average Campus Rating</span>
            <Star size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{avgRating} ★</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Across {products.length} listings</div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Dispute Rate</span>
            <AlertTriangle size={16} color="#dc2626" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{disputeRate}%</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            {disputes.filter((d) => d.status === 'Open').length} open dispute(s)
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
        {[
          { id: 'approvals', label: `Approvals (${pendingSellers.length + pendingProducts.length})` },
          { id: 'disputes', label: `Disputes & Moderation (${disputes.length})` },
          { id: 'orders', label: `All Orders (${orders.length})` },
          { id: 'ads', label: 'Ads & Brand Partnerships' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`btn-sm ${tab === t.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Approvals Tab */}
      {tab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h3 style={{ margin: '0 0 12px' }}>Pending Student Seller Verifications</h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Storefront</th>
                    <th>Student &amp; ID</th>
                    <th>Hall / Faculty</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSellers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>
                        All seller applications reviewed!
                      </td>
                    </tr>
                  ) : (
                    pendingSellers.map((ps) => (
                      <tr key={ps.id}>
                        <td>
                          <strong>{ps.name}</strong>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{ps.bio}</div>
                        </td>
                        <td>
                          {ps.owner}
                          <div style={{ fontSize: 11, color: '#18181b', fontWeight: 600 }}>
                            {ps.studentId} • {ps.email}
                          </div>
                        </td>
                        <td>{ps.hall} / {ps.faculty}</td>
                        <td>{ps.submittedAt}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => onApproveSeller(ps.id)}
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              type="button"
                              className="btn-outline btn-sm"
                              style={{ color: '#dc2626', borderColor: '#fecaca' }}
                              onClick={() => onRejectSeller(ps.id)}
                            >
                              <X size={13} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px' }}>Listing Moderation Queue</h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td>{p.category}</td>
                      <td>GH₵{p.price.toFixed(2)}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: p.status === 'approved' ? '#16a34a' : '#d97706' }}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.status !== 'approved' ? (
                          <button type="button" className="btn-primary btn-sm" onClick={() => onApproveListing(p.id)}>
                            Approve Listing
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#64748b' }}>Live on Marketplace</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Disputes & Review Moderation */}
      {tab === 'disputes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h3 style={{ margin: '0 0 12px' }}>Open &amp; Resolved Disputes</h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dispute ID</th>
                    <th>Order</th>
                    <th>Reporter</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.id}</strong></td>
                      <td>#{d.orderId}</td>
                      <td>{d.reporter}</td>
                      <td>{d.reason}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: d.status === 'Resolved' ? '#16a34a' : '#dc2626' }}>
                          {d.status}
                        </span>
                      </td>
                      <td>
                        {d.status === 'Open' ? (
                          <button type="button" className="btn-primary btn-sm" onClick={() => onResolveDispute(d.id)}>
                            Resolve &amp; Close
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#64748b' }}>Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px' }}>Review Moderation</h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Visibility</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id}>
                      <td>{r.author}</td>
                      <td>{r.rating} ★</td>
                      <td>{r.comment}</td>
                      <td>{r.status}</td>
                      <td>
                        <button type="button" className="btn-outline btn-sm" onClick={() => onToggleReviewVisibility(r.id)}>
                          {r.status === 'visible' ? 'Hide Review' : 'Restore'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* All Orders */}
      {tab === 'orders' && (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>5% Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.buyerName} ({o.buyerHall})</td>
                  <td>{o.paymentMethod}</td>
                  <td>GH₵{o.total.toFixed(2)}</td>
                  <td>GH₵{(o.commissionFee || o.total * 0.05).toFixed(2)}</td>
                  <td><strong>{o.status}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ads & Brand Partnerships */}
      {tab === 'ads' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {partnerships.map((ad) => (
            <div key={ad.id} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <Megaphone size={16} color="#f58220" /> {ad.brand}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{ad.placement}</div>
                <div style={{ fontSize: 12, color: '#18181b', fontWeight: 600, marginTop: 2 }}>{ad.discount}</div>
              </div>
              <button
                type="button"
                className={`btn-sm ${ad.active ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onTogglePartnership(ad.id)}
              >
                {ad.active ? 'Active' : 'Paused'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
