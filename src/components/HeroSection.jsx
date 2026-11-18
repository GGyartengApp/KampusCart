import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck, Store } from 'lucide-react';
import ProductIllustration from './ProductIllustration';
import ScrollLookbookHero from './ScrollLookbookHero';

export default function HeroSection({ products, onBrowse, onStartSelling, onSelectProduct }) {
  const featuredSlides = products.filter((p) => p.featured).slice(0, 5);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isLaptop, setIsLaptop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLaptop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const current = featuredSlides[slideIdx] || products[0];

  const prevSlide = () =>
    setSlideIdx((i) => (i - 1 + featuredSlides.length) % featuredSlides.length);
  const nextSlide = () =>
    setSlideIdx((i) => (i + 1) % featuredSlides.length);

  return (
    <>
      {/* 1. LAPTOP FULL-SCREEN SCROLL-DRIVEN LOOKBOOK HERO (>= 1024px) OR COMPACT MOBILE HERO */}
      {isLaptop ? (
        <ScrollLookbookHero onBrowse={onBrowse} onStartSelling={onStartSelling} />
      ) : (
      <section className="catalog-hero">
        <div className="container">
          {/* Floating Pill Bar from Picture */}
          <div className="catalog-floating-nav">
            <div className="catalog-pill">
              <span
                style={{
                  background: '#facc15',
                  color: '#0e3329',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 11,
                }}
              >
                KC
              </span>
              <span style={{ fontWeight: 800, fontSize: 13 }}>Kampus Catalog</span>
            </div>

            <div className="catalog-pill" style={{ gap: 2 }}>
              {['All Drops', 'Sneakers', 'Campus Tech', 'Hot Meals', 'Tutoring'].map((tab, idx) => (
                <button
                  key={tab}
                  type="button"
                  className={`catalog-pill-link ${idx === 0 ? 'active' : ''}`}
                  onClick={() => onBrowse(idx === 1 ? 'Fashion' : idx === 2 ? 'Tech' : idx === 3 ? 'Food' : idx === 4 ? 'Tutoring' : 'All')}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="catalog-pill" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              <ShieldCheck size={15} color="#4ade80" />
              <span style={{ fontSize: 12, fontWeight: 600 }}>100% Verified Students</span>
            </div>
          </div>

          {/* Diagonal Slashed Product Panels + Bold Typography */}
          <div className="catalog-hero-stage">
            <div className="slash-panels" aria-hidden="true">
              <div className="slash-panel" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(11,70,45,0.6))' }}>
                <div>
                  <ProductIllustration art="sneaker" color="#facc15" accent="#f58220" size={115} />
                </div>
              </div>
              <div className="slash-panel" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(15,118,110,0.65))' }}>
                <div>
                  <ProductIllustration art={current.art} color="#ffffff" accent="#f58220" size={135} />
                </div>
              </div>
              <div className="slash-panel" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(245,130,32,0.4))' }}>
                <div>
                  <ProductIllustration art="headphones" color="#fde047" accent="#ffffff" size={115} />
                </div>
              </div>
            </div>

            <div className="catalog-hero-overlay">
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(250, 204, 21, 0.16)',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  color: '#fde047',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                MOBILE-FIRST CAMPUS MARKETPLACE
              </div>

              <h1 className="catalog-hero-title">
                DESIGN &amp;
                <br />
                HIGH QUALITY
              </h1>
              <p className="catalog-hero-sub">
                Discover student-made fashion, campus tech, hot dorm meals, tutoring, and express printing — verified by Student ID with safe campus meet-ups.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button type="button" className="btn-orange" onClick={() => onBrowse('All')}>
                  Browse Marketplace <ArrowUpRight size={16} />
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
                  onClick={onStartSelling}
                >
                  <Store size={16} /> Start Selling Free
                </button>
              </div>
            </div>
          </div>

          {/* Slide Counter & Featured Model Footer (from Picture) */}
          <div className="catalog-hero-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {slideIdx + 1} / {featuredSlides.length}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.35)',
                    background: 'transparent',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.35)',
                    background: 'transparent',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
              <strong>{current.title}</strong> — <span style={{ color: '#fde047' }}>${current.price.toFixed(2)}</span> ({current.hall})
            </div>

            <button
              type="button"
              onClick={() => onSelectProduct(current)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              View Product <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>
      )}

      {/* 2. SHOPCART-INSPIRED SKY BLUE & GOLDEN PODIUM BANNER (from video 00:01) */}
      <section className="shopcart-hero">
        <div className="container shopcart-hero-grid">
          <div>
            <h2>
              Shopping And
              <br />
              Campus Store.
            </h2>
            <p>
              Connecting student entrepreneurs to buyers across every hall and faculty. Free storefronts, verified student badges, and escrow-protected Mobile Money, Card, or Pay on Delivery.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ background: '#ffffff', color: '#141312' }}
                onClick={() => onBrowse('All')}
              >
                Browse Deals
              </button>
              <button
                type="button"
                className="btn-outline"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.32)',
                }}
                onClick={onStartSelling}
              >
                Start Selling
              </button>
            </div>
          </div>

          <div className="podium-stage">
            {[
              {
                category: 'Food',
                className: 'podium-block podium-1',
                image: '/images/food/bowl1.jpg',
                title: 'Hot Meals',
                subtitle: 'From $8.50',
                titleSize: 13,
              },
              {
                category: 'Tech',
                className: 'podium-block podium-2',
                image: '/images/podium/campus-tech.jpg',
                title: 'Campus Tech',
                subtitle: 'Up to 50% Off',
                titleSize: 14,
              },
              {
                category: 'Fashion',
                className: 'podium-block podium-3',
                image: '/images/podium/sneakers.jpg',
                title: 'Sneakers',
                subtitle: 'North Hall Drops',
                titleSize: 13,
              },
            ].map((card) => (
              <div
                key={card.title}
                className={card.className}
                onClick={() => onBrowse(card.category)}
                style={{
                  cursor: 'pointer',
                  padding: 0,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  background: '#181614',
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
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
                      'linear-gradient(180deg, rgba(15, 23, 42, 0.02) 35%, rgba(15, 23, 42, 0.78) 100%)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1, padding: '12px 10px' }}>
                  <div style={{ fontWeight: 700, fontSize: card.titleSize, color: '#ffffff' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.86)' }}>
                    {card.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Full-Width Animated Brand Marquee */}
        <div className="brand-marquee-wrap" aria-label="Featured campus and partner brands">
          <div className="brand-marquee-track">
            {(() => {
              const brands = [
                { name: 'Jordan', src: '/images/brands/jordan.webp', mode: 'screen' },
                { name: 'Givenchy', src: '/images/brands/givenchy.jpg', mode: 'invert' },
                { name: 'Giorgio Armani', src: '/images/brands/armani.jpg', mode: 'invert' },
                { name: 'Oraimo', src: '/images/brands/oraimo.png', mode: 'normal' },
                { name: 'Versace', src: '/images/brands/versace.jpg', mode: 'invert' },
                { name: 'Valentino', src: '/images/brands/valentino.jpg', mode: 'invert' },
                { name: 'Chanel', src: '/images/brands/chanel.jpg', mode: 'invert' },
                { name: 'Dior', src: '/images/brands/dior.jpg', mode: 'invert' },
                { name: 'Prada', src: '/images/brands/prada.jpg', mode: 'invert' },
              ];
              return [...brands, ...brands].map((brand, idx) => (
                <span key={`${brand.name}-${idx}`} className="brand-marquee-item">
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className={`brand-marquee-logo${
                      brand.mode === 'invert'
                        ? ' brand-marquee-logo--invert'
                        : brand.mode === 'screen'
                        ? ' brand-marquee-logo--screen'
                        : ''
                    }`}
                  />
                </span>
              ));
            })()}
          </div>
        </div>
      </section>
    </>
  );
}
