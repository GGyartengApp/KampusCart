import React from 'react';
import { ArrowRight, HelpCircle, CreditCard, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import ProductCard from './ProductCard';
import ProductIllustration from './ProductIllustration';

export default function HomeSections({
  products,
  sellers,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onBrowseCategory,
  onOpenAuth,
  onNavigate,
}) {
  const approvedProducts = products.filter((p) => p.status === 'approved');
  const popularProducts = approvedProducts.slice(0, 4);
  const newArrivals = approvedProducts.slice(4, 8);
  const getSeller = (sellerId) => sellers.find((s) => s.id === sellerId);

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 56 }}>
      {/* 1. Shop Our Top Categories (Shopcart video 00:01) */}
      <section>
        <div className="section-head">
          <h2 className="section-title">Shop Our Top Categories</h2>
          <button type="button" className="btn-outline btn-sm" onClick={() => onBrowseCategory('All')}>
            Explore All <ArrowRight size={14} />
          </button>
        </div>
        <div className="categories-strip">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="category-tile"
              style={{ background: cat.bg }}
              onClick={() => onBrowseCategory(cat.id)}
            >
              <span>{cat.name}</span>
              <ProductIllustration art={cat.art} color={cat.color} accent={cat.accent} size={76} />
              <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.9 }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Our Popular Products (Catalog picture) */}
      <section>
        <div className="section-head">
          <h2 className="section-title">Our Popular Products</h2>
          <button type="button" className="btn-outline btn-sm" onClick={() => onBrowseCategory('All')}>
            Explore More <ArrowRight size={14} />
          </button>
        </div>
        <div className="products-grid">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              seller={getSeller(product.sellerId)}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 3. Grab Upto 50% Off Cream Promo Banner (Shopcart video 00:06) */}
      <section className="cream-promo-banner">
        <div style={{ maxWidth: 520 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              color: '#0b462d',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            <Sparkles size={13} /> CAMPUS FLASH DEAL
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0b462d', margin: '0 0 10px' }}>
            Grab Upto 50% Off On Selected Campus Tech
          </h2>
          <p style={{ margin: '0 0 18px', color: '#475569', fontSize: 14 }}>
            Student-tested headphones, laptop sleeves, and study gear with verified campus warranty.
          </p>
          <button type="button" className="btn-primary" onClick={() => onBrowseCategory('Tech')}>
            Buy Now
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProductIllustration art="headphones" color="#0b462d" accent="#f58220" size={140} />
        </div>
      </section>

      {/* 4. Best Campus Collection + SIGN UP & GET 25% OFF (Catalog picture) */}
      <section>
        <div className="section-head">
          <h2 className="section-title">Best Campus Collection</h2>
          <button type="button" className="btn-outline btn-sm" onClick={() => onBrowseCategory('Fashion')}>
            Explore More <ArrowRight size={14} />
          </button>
        </div>
        <div className="collection-grid">
          <div className="collection-card" style={{ background: '#f1f5f9' }}>
            <div>
              <span className="verified-badge"><ShieldCheck size={11} /> KicksByKofi</span>
              <h3 style={{ margin: '10px 0 4px', fontSize: 20 }}>North Hall Streetwear</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Sneakers &amp; handprinted totes</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <button type="button" className="btn-outline btn-sm" onClick={() => onBrowseCategory('Fashion')}>
                Shop Fashion
              </button>
              <ProductIllustration art="sneaker" color="#0b462d" accent="#f58220" size={96} />
            </div>
          </div>

          <div
            className="collection-card"
            style={{
              background: 'linear-gradient(135deg, #133c31, #0b462d)',
              color: '#ffffff',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#fde047' }}>
              VERIFIED STUDENT PERK
            </span>
            <h3 style={{ margin: 0, fontSize: 26, lineHeight: 1.15 }}>
              SIGN UP &amp; GET
              <br />
              25% OFF
            </h3>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>
              Verify your .edu email or Student ID to unlock CAMPUS25.
            </p>
            <button type="button" className="btn-orange btn-sm" onClick={onOpenAuth}>
              Verify Student ID
            </button>
          </div>

          <div className="collection-card" style={{ background: '#fef3c7' }}>
            <div>
              <span className="verified-badge"><ShieldCheck size={11} /> Apex Tutors</span>
              <h3 style={{ margin: '10px 0 4px', fontSize: 20 }}>Finals Prep &amp; Printing</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>1-on-1 tutoring &amp; same-hour binding</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <button type="button" className="btn-outline btn-sm" onClick={() => onBrowseCategory('Tutoring')}>
                Explore Study
              </button>
              <ProductIllustration art="tutoring" color="#1e3a8a" accent="#f58220" size={96} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Refine Your Style With New Arrivals (Catalog picture right grid) */}
      <section>
        <div className="section-head">
          <h2 className="section-title">Refine Your Style With New Arrivals!</h2>
          <button type="button" className="btn-outline btn-sm" onClick={() => onBrowseCategory('All')}>
            Explore More <ArrowRight size={14} />
          </button>
        </div>
        <div className="products-grid">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              seller={getSeller(product.sellerId)}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. Services To Help You Shop (Shopcart video 00:09) */}
      <section>
        <div className="section-head">
          <h2 className="section-title">Services To Help You Shop</h2>
        </div>
        <div className="collection-grid">
          <div
            onClick={() => onNavigate('about')}
            style={{ background: '#f8fafc', borderRadius: 18, padding: 24, border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            <HelpCircle size={28} color="#0b462d" />
            <h3 style={{ margin: '14px 0 6px', fontSize: 18 }}>Frequently Asked Questions</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Updates on Safe Shopping on Campus, Student ID verification, and 5% seller commission.
            </p>
          </div>

          <div
            onClick={() => onNavigate('about')}
            style={{ background: '#f8fafc', borderRadius: 18, padding: 24, border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            <CreditCard size={28} color="#0b462d" />
            <h3 style={{ margin: '14px 0 6px', fontSize: 18 }}>Online Payment Process</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Pay securely with Mobile Money, Card, or Pay on Delivery. Escrow protects every order.
            </p>
          </div>

          <div
            onClick={() => onNavigate('about')}
            style={{ background: '#f8fafc', borderRadius: 18, padding: 24, border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            <MapPin size={28} color="#0b462d" />
            <h3 style={{ margin: '14px 0 6px', fontSize: 18 }}>Safe Campus Meet-Up Points</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Choose staffed campus spots like Main Library Lobby or Student Union Plaza, or dorm delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Elegance Craft Accent Bottom Banner (Catalog picture bottom right) */}
      <section className="elegance-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 14 }}>
            <ProductIllustration art="sneaker" color="#fde047" accent="#f58220" size={115} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fde047', marginBottom: 6 }}>
              FEATURED STUDENT CRAFT
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              Elegance Craft Accent <span style={{ color: '#f58220' }}>Campus Drops</span>
            </h2>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85, maxWidth: 440 }}>
              Support verified student creators across Engineering, Business, and Arts &amp; Design. Zero listing fees, 100% campus-verified.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              background: '#ffffff',
              color: '#0e3329',
              fontWeight: 800,
              fontSize: 14,
              padding: '8px 14px',
              borderRadius: 999,
            }}
          >
            From $8.50
          </span>
          <button type="button" className="btn-orange" onClick={() => onBrowseCategory('All')}>
            Start Shopping <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
