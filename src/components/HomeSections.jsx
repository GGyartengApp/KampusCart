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

      {/* 7. Elegance Craft Accent Bottom Banner */}
      <section className="elegance-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          {/* Paint-Splatter High-Top Sneaker popping above the slanted top edge */}
          <div style={{ marginTop: -118, flexShrink: 0, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.35))' }}>
            <svg
              width="285"
              height="242"
              viewBox="0 0 260 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Paint-splatter high-top sneaker"
            >
              {/* Paint splatters & drips behind shoe */}
              <ellipse cx="110" cy="184" rx="88" ry="12" fill="rgba(0,0,0,0.42)" />
              <path d="M22 142 C10 120, 26 92, 46 82 L68 122 L38 164 Z" fill="#f97316" />
              <path d="M52 54 L66 28 L76 62 Z" fill="#38bdf8" />
              <path d="M128 74 L165 44 L148 84 Z" fill="#ec4899" />
              <path d="M162 110 L218 96 L180 130 Z" fill="#22d3ee" />
              <path d="M142 144 L212 154 L160 166 Z" fill="#f59e0b" />
              <circle cx="48" cy="40" r="4" fill="#22d3ee" />
              <circle cx="152" cy="48" r="3.5" fill="#facc15" />
              <circle cx="192" cy="86" r="3" fill="#ec4899" />
              <circle cx="206" cy="134" r="4" fill="#38bdf8" />
              <rect x="64" y="182" width="4" height="22" rx="2" fill="#22d3ee" />
              <rect x="78" y="184" width="3.5" height="28" rx="1.75" fill="#f97316" />
              <rect x="114" y="184" width="3" height="19" rx="1.5" fill="#ec4899" />

              {/* High-top upper silhouette */}
              <path
                d="M42 152 L54 46 C56 36, 72 34, 86 42 L114 58 L138 106 L208 134 C226 141, 232 158, 224 168 L42 168 Z"
                fill="#ffffff"
                stroke="#111827"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Colorful paint-splatter panels */}
              <path d="M52 72 L98 54 L106 88 L49 102 Z" fill="#38bdf8" />
              <path d="M46 106 L94 94 L108 136 L43 148 Z" fill="#ec4899" />
              <path d="M70 116 L114 104 L126 146 L76 154 Z" fill="#facc15" />
              <path d="M108 82 L134 106 L160 124 L132 148 L104 128 Z" fill="#f97316" />
              <path d="M138 118 L178 130 L166 152 L130 148 Z" fill="#a855f7" />
              <path d="M56 44 L86 42 L102 64 L54 68 Z" fill="#22d3ee" />
              <path d="M84 44 L112 58 L100 78 L80 62 Z" fill="#fb923c" />

              {/* White perforated toe box */}
              <path
                d="M158 132 L210 138 C224 142, 228 156, 222 164 L148 164 Z"
                fill="#f8fafc"
                stroke="#111827"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <circle cx="178" cy="147" r="1.8" fill="#334155" />
              <circle cx="188" cy="149" r="1.8" fill="#334155" />
              <circle cx="198" cy="151" r="1.8" fill="#334155" />
              <circle cx="183" cy="156" r="1.8" fill="#334155" />
              <circle cx="194" cy="157" r="1.8" fill="#334155" />

              {/* Eyelets & crisp white laces */}
              <path d="M104 56 L156 132" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
              <path d="M110 64 L130 62" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
              <path d="M110 64 L130 62" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M118 78 L139 76" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
              <path d="M118 78 L139 76" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M127 92 L149 90" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
              <path d="M127 92 L149 90" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M136 106 L159 104" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
              <path d="M136 106 L159 104" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M146 120 L169 118" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
              <path d="M146 120 L169 118" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              {/* Loose hanging white lace */}
              <path
                d="M108 62 C88 74, 86 112, 92 142"
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <path
                d="M108 62 C88 74, 86 112, 92 142"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Vulcanized midsole (orange heel to white toe) */}
              <path
                d="M36 154 L148 160 L226 164 C230 164, 230 178, 222 180 L146 178 L36 170 C30 170, 30 154, 36 154 Z"
                fill="#f8fafc"
                stroke="#111827"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M36 154 L138 160 L138 177 L36 170 C30 170, 30 154, 36 154 Z"
                fill="#f59e0b"
                stroke="#111827"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fde047', marginBottom: 6, letterSpacing: '0.04em' }}>
              FEATURED STUDENT CRAFT
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(1.6rem, 3vw, 2.35rem)', lineHeight: 1.12 }}>
              Elegance Craft Accent <span style={{ color: '#f58220' }}>Campus Drops</span>
            </h2>
            <p style={{ margin: '0 0 18px', fontSize: 14, opacity: 0.88, maxWidth: 440, lineHeight: 1.55 }}>
              Support verified student creators across Engineering, Business, and Arts &amp; Design. Zero listing fees, 100% campus-verified.
            </p>
            <button type="button" className="btn-orange" onClick={() => onBrowseCategory('Fashion')}>
              Start Shopping <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              background: '#ffffff',
              color: '#0e3329',
              fontWeight: 800,
              fontSize: 15,
              padding: '10px 18px',
              borderRadius: 10,
              transform: 'rotate(-8deg)',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.24)',
              display: 'inline-block',
            }}
          >
            From GH₵8.50
          </span>
        </div>
      </section>
    </div>
  );
}
