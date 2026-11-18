import React from 'react';
import { ArrowRight, HelpCircle, CreditCard, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import ProductCard from './ProductCard';

const CATEGORY_IMAGES = {
  Food: '/images/food/bowl1.jpg',
  Fashion: '/images/products/dunk-low.jpg',
  Tech: '/images/products/airpods-max.jpg',
  Services: '/images/products/laundry-bundle.jpg',
  Tutoring: '/images/products/exam-prep.jpg',
  Printing: '/images/products/thesis-binding.jpg',
};

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
              style={{ background: '#181614', justifyContent: 'flex-end', alignItems: 'flex-start', textAlign: 'left' }}
              onClick={() => onBrowseCategory(cat.id)}
            >
              <img
                src={CATEGORY_IMAGES[cat.id]}
                alt={cat.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(15,23,42,0.08) 25%, rgba(15,23,42,0.82) 100%)',
                }}
              />
              <span style={{ position: 'relative', zIndex: 1, fontSize: 16, fontWeight: 700 }}>{cat.name}</span>
              <span style={{ position: 'relative', zIndex: 1, fontSize: 11, fontWeight: 500, opacity: 0.9 }}>
                {cat.count}
              </span>
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

      {/* 3. Grab Upto 50% Off Campus Tech Promo Banner */}
      <section
        className="cream-promo-banner"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#181614',
          minHeight: 240,
        }}
      >
        <img
          src="/images/podium/campus-tech.jpg"
          alt="Selected Campus Tech"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(17, 16, 14, 0.86) 0%, rgba(17, 16, 14, 0.58) 54%, rgba(17, 16, 14, 0.18) 100%)',
          }}
        />
        <div style={{ maxWidth: 520, position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.26)',
              color: '#ffffff',
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            <Sparkles size={13} /> CAMPUS FLASH DEAL
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#ffffff', margin: '0 0 10px' }}>
            Grab Upto 50% Off On Selected Campus Tech
          </h2>
          <p style={{ margin: '0 0 18px', color: 'rgba(255, 255, 255, 0.88)', fontSize: 14 }}>
            Student-tested headphones, laptop sleeves, and study gear with verified campus warranty.
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: '#ffffff',
              color: '#141312',
              border: 'none',
            }}
            onClick={() => onBrowseCategory('Tech')}
          >
            Buy Now
          </button>
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
              <img
                src="/images/products/dunk-low.jpg"
                alt="North Hall Streetwear"
                style={{ width: 96, height: 76, objectFit: 'cover', borderRadius: 12, display: 'block' }}
              />
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
              <img
                src="/images/products/exam-prep.jpg"
                alt="Finals Prep & Printing"
                style={{ width: 96, height: 76, objectFit: 'cover', borderRadius: 12, display: 'block' }}
              />
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
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 8 }}>
            <img
              src="/images/podium/sneakers.jpg"
              alt="Elegance Craft Accent Campus Drops"
              style={{ width: 124, height: 100, objectFit: 'cover', borderRadius: 14, display: 'block' }}
            />
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
