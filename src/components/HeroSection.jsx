import React from 'react';
import ScrollLookbookHero from './ScrollLookbookHero';

export default function HeroSection({ onBrowse, onStartSelling }) {
  return (
    <>
      {/* 1. FULL-SCREEN SCROLL-DRIVEN LOOKBOOK HERO (all devices) */}
      <ScrollLookbookHero onBrowse={onBrowse} onStartSelling={onStartSelling} />

      {/* 2. DARK EDITORIAL PODIUM BANNER */}
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
                subtitle: 'From GH₵8.50',
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
