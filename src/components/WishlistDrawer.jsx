import React from 'react';
import { X, Heart } from 'lucide-react';
import ProductIllustration from './ProductIllustration';

export default function WishlistDrawer({ isOpen, products, wishlistIds, onClose, onToggleWishlist, onAddToCart, onSelectProduct }) {
  if (!isOpen) return null;

  const items = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={18} color="#ef4444" fill="#ef4444" />
            <strong style={{ fontSize: 16 }}>Saved Wishlist ({items.length})</strong>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60, color: '#64748b' }}>
              No saved items yet. Tap the heart icon on any product!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}
                >
                  <div
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    style={{ width: 54, height: 54, borderRadius: 10, background: '#f7f7f7', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                  >
                    <ProductIllustration art={item.art} color={item.colors[0]} size={42} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#0b462d', fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button type="button" className="btn-primary btn-sm" onClick={() => onAddToCart(item)}>
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(item.id)}
                      style={{ background: 'none', border: 'none', fontSize: 11, color: '#dc2626' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
