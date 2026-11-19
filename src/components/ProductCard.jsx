import React from 'react';
import { Heart, ShieldCheck, Star } from 'lucide-react';
import ProductIllustration from './ProductIllustration';

export default function ProductCard({
  product,
  seller,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) {
  return (
    <article className="product-card">
      <div className="product-img-stage" onClick={() => onSelectProduct(product)}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ProductIllustration
            art={product.art}
            color={product.colors[0] || '#0b462d'}
            accent={product.colors[1] || '#f58220'}
            size={128}
          />
        )}

        {product.featured && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: '#0e3329',
              color: '#fde047',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            FEATURED
          </span>
        )}

        <button
          type="button"
          className={`wishlist-fab ${isWishlisted ? 'active' : ''}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
        >
          <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3
          onClick={() => onSelectProduct(product)}
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            color: '#0f172a',
            lineHeight: 1.3,
          }}
        >
          {product.title}
        </h3>
        <strong style={{ fontSize: 15, color: '#0b462d', whiteSpace: 'nowrap' }}>
          GH₵{product.price.toFixed(2)}
        </strong>
      </div>

      <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
        {product.shortDesc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {seller?.verified && (
          <span className="verified-badge">
            <ShieldCheck size={11} /> {seller.name}
          </span>
        )}
        <span style={{ fontSize: 11, color: '#64748b' }}>• {product.hall}</span>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <Star size={14} fill="#16a34a" color="#16a34a" />
          <strong>{product.rating.toFixed(1)}</strong>
          <span style={{ color: '#64748b' }}>({product.reviewCount})</span>
        </div>

        <button
          type="button"
          className="btn-outline btn-sm"
          disabled={product.stock <= 0}
          onClick={() => onAddToCart(product)}
          style={{
            borderColor: '#0b462d',
            color: '#0b462d',
            opacity: product.stock <= 0 ? 0.5 : 1,
          }}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
}
