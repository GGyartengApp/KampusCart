import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import ProductIllustration from './ProductIllustration';

export default function CartDrawer({ isOpen, items, onClose, onUpdateQty, onRemove, onCheckout }) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={18} color="#0b462d" />
            <strong style={{ fontSize: 16 }}>Your Campus Cart ({items.reduce((s, i) => s + i.qty, 0)})</strong>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60, color: '#64748b' }}>
              <ShoppingBag size={42} style={{ opacity: 0.35, marginBottom: 10 }} />
              <div style={{ fontWeight: 600 }}>Your cart is empty</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Explore food, tech, sneakers, or tutoring on campus!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.colorName}`}
                  style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}
                >
                  <div style={{ width: 58, height: 58, borderRadius: 10, background: '#f7f7f7', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <ProductIllustration art={item.art} color={item.color} size={46} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{item.colorName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.productId, item.colorName, -1)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}
                      >
                        −
                      </button>
                      <strong style={{ fontSize: 13 }}>{item.qty}</strong>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.productId, item.colorName, 1)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: 14 }}>${(item.price * item.qty).toFixed(2)}</strong>
                    <div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.productId, item.colorName)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', marginTop: 6 }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 20, borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 15 }}>
              <span>Subtotal</span>
              <strong style={{ color: '#0b462d' }}>${subtotal.toFixed(2)}</strong>
            </div>
            <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
