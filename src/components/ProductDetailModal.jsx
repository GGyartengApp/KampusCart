import React, { useState } from 'react';
import { X, Star, ShieldCheck, MessageCircle, MapPin, Truck, Flag, Heart } from 'lucide-react';
import ProductIllustration from './ProductIllustration';

export default function ProductDetailModal({
  product,
  seller,
  reviews,
  isWishlisted,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onOpenChat,
  onReportListing,
}) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [reportNote, setReportNote] = useState('');
  const [showReportBox, setShowReportBox] = useState(false);

  if (!product) return null;

  const activeColor = product.colors[selectedColorIdx] || '#18181b';
  const activeColorName = product.colorNames?.[selectedColorIdx] || 'Standard';
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'visible');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          style={{
            position: 'sticky',
            top: 0,
            float: 'right',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Breadcrumb (Shopcart video 00:13) */}
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 18 }}>
          Marketplace / {product.category} / {product.hall} / <strong style={{ color: '#0f172a' }}>{product.title}</strong>
        </div>

        {/* 2-Column Product Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
          {/* Left Image Gallery */}
          <div>
            <div
              style={{
                background: '#f7f7f7',
                borderRadius: 18,
                height: 290,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <ProductIllustration
                  art={product.art}
                  color={activeColor}
                  accent={product.colors[(selectedColorIdx + 1) % product.colors.length] || '#f58220'}
                  size={190}
                />
              )}
              <button
                type="button"
                className={`wishlist-fab ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
              >
                <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {product.colors.map((c, idx) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  style={{
                    flex: 1,
                    height: 62,
                    borderRadius: 12,
                    background: '#f7f7f7',
                    border: selectedColorIdx === idx ? '2px solid #18181b' : '1px solid #e2e8f0',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ProductIllustration art={product.art} color={c} size={42} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Info & Actions */}
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 24 }}>{product.title}</h2>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Star size={16} fill="#16a34a" color="#16a34a" />
              <strong>{product.rating.toFixed(1)}</strong>
              <span style={{ fontSize: 13, color: '#64748b' }}>({product.reviewCount} verified reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: 14 }}>
              <strong style={{ fontSize: 24, color: '#18181b' }}>GH₵{product.price.toFixed(2)}</strong>
              {product.originalPrice > product.price && (
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: 14 }}>
                  GH₵{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                Escrow Protected
              </span>
            </div>

            {/* Color / Variant Swatches */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                Choose Option: <span style={{ color: '#18181b' }}>{activeColorName}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.colors.map((c, idx) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={product.colorNames?.[idx] || c}
                    onClick={() => setSelectedColorIdx(idx)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: c,
                      border: selectedColorIdx === idx ? '3px solid #ffffff' : '1px solid #cbd5e1',
                      boxShadow: selectedColorIdx === idx ? '0 0 0 2px #18181b' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity & Urgency (Shopcart video 00:13) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 999, padding: '4px 10px', gap: 14 }}>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ border: 'none', background: 'none', fontSize: 18, fontWeight: 700 }}
                >
                  −
                </button>
                <strong style={{ fontSize: 14 }}>{qty}</strong>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  style={{ border: 'none', background: 'none', fontSize: 18, fontWeight: 700 }}
                >
                  +
                </button>
              </div>
              <div style={{ fontSize: 12 }}>
                Only <strong style={{ color: '#f58220' }}>{product.stock} Items</strong> Left!
                <div style={{ color: '#64748b' }}>Don&apos;t miss it</div>
              </div>
            </div>

            {/* Buy Now / Add to Cart */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1 }}
                disabled={product.stock <= 0}
                onClick={() => onBuyNow(product, qty, activeColorName)}
              >
                Buy Now
              </button>
              <button
                type="button"
                className="btn-outline"
                style={{ flex: 1, borderColor: '#18181b', color: '#18181b' }}
                disabled={product.stock <= 0}
                onClick={() => onAddToCart(product, qty, activeColorName)}
              >
                Add to Cart
              </button>
            </div>

            {/* Delivery & Seller Profile Card */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <Truck size={16} color="#f58220" />
                <span>
                  <strong>{product.deliveryOption}</strong> • {product.hall} ({product.faculty})
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <MapPin size={16} color="#18181b" />
                <span>Safe Meet-up Available at Main Library &amp; Student Union</span>
              </div>

              {seller && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: 14 }}>{seller.name}</strong>
                      {seller.verified && (
                        <span className="verified-badge">
                          <ShieldCheck size={11} /> Verified Student
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {seller.owner} • {seller.rating} ★ ({seller.totalSales} sales)
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => onOpenChat(seller, product)}
                  >
                    <MessageCircle size={14} /> Chat Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Specifications Table (Shopcart video 00:18) */}
        <div style={{ marginTop: 28 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Full Specifications</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <tbody>
                {Object.entries(product.specs || {}).map(([k, v]) => (
                  <tr key={k}>
                    <th style={{ width: '35%' }}>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews & Report Listing */}
        <div style={{ marginTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Student Reviews ({productReviews.length})</h3>
          <button
            type="button"
            className="btn-outline btn-sm"
            style={{ color: '#dc2626', borderColor: '#fecaca' }}
            onClick={() => setShowReportBox((s) => !s)}
          >
            <Flag size={13} /> Report Listing
          </button>
        </div>

        {showReportBox && (
          <div style={{ marginTop: 12, padding: 14, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Report suspicious or prohibited item</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Reason (e.g., misleading photos, off-campus scam)..."
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
              />
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ background: '#dc2626' }}
                onClick={() => {
                  if (reportNote.trim()) {
                    onReportListing(product, reportNote);
                    setReportNote('');
                    setShowReportBox(false);
                  }
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {productReviews.length === 0 ? (
            <div style={{ fontSize: 13, color: '#64748b' }}>No written reviews yet. Complete an order to leave the first review!</div>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} style={{ padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <strong>{rev.author}</strong>
                  <span style={{ color: '#64748b' }}>{rev.date}</span>
                </div>
                <div style={{ color: '#16a34a', fontSize: 12, marginBottom: 4 }}>{'★'.repeat(rev.rating)}</div>
                <div style={{ fontSize: 13, color: '#334155' }}>{rev.comment}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
