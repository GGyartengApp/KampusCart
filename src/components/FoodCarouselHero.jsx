import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck } from 'lucide-react';

const FOOD_SLIDES = [
  {
    productId: 'prod-4',
    word: 'smoky',
    title: 'Smoky Jollof & Chicken Bowl',
    subtitle: 'Hot party-style jollof, grilled spicy chicken & sweet plantain',
    image: '/images/food/bowl1.jpg',
  },
  {
    productId: 'prod-11',
    word: 'matcha',
    title: 'Boba & Iced Matcha Study Duo',
    subtitle: '2 large cold-brew matcha & brown sugar boba teas',
    image: '/images/food/matcha.jpg',
  },
  {
    productId: 'prod-4',
    word: 'grilled',
    title: 'Late-Night Jollof Express',
    subtitle: 'Freshly packed insulated meal bowl — ready in 20 mins',
    image: '/images/food/grilled.jpg',
  },
  {
    productId: 'prod-11',
    word: 'chilled',
    title: 'Brown Sugar Boba Refresh',
    subtitle: 'Delivered straight to Main Library or Science Quad',
    image: '/images/food/boba.jpg',
  },
];

export default function FoodCarouselHero({ foodProducts, sellers, onAddToCart, onSelectProduct }) {
  const [activeIdx, setActiveIdx] = useState(1);
  const dragStartX = useRef(null);

  const slides = FOOD_SLIDES.map((s, idx) => {
    const prod =
      foodProducts.find((p) => p.id === s.productId) ||
      foodProducts[idx % Math.max(1, foodProducts.length)];
    return { ...s, product: prod };
  }).filter((s) => s.product);

  if (slides.length === 0) return null;

  const safeIdx = activeIdx % slides.length;
  const goPrev = () => setActiveIdx((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIdx((i) => (i + 1) % slides.length);

  const getOffset = (idx) => {
    let diff = idx - safeIdx;
    if (diff > slides.length / 2) diff -= slides.length;
    if (diff < -slides.length / 2) diff += slides.length;
    return diff;
  };

  return (
    <section
      style={{
        background: '#f1f5f9',
        borderRadius: 26,
        padding: '28px 20px 22px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}
      onPointerDown={(e) => {
        dragStartX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (dragStartX.current === null) return;
        const dx = e.clientX - dragStartX.current;
        if (dx < -40) goNext();
        else if (dx > 40) goPrev();
        dragStartX.current = null;
      }}
    >
      {/* 3-Card Spotlight Stage */}
      <div
        style={{
          position: 'relative',
          height: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 960,
          margin: '0 auto',
          userSelect: 'none',
        }}
      >
        {/* Left Frosted Arrow */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous food item"
          style={{
            position: 'absolute',
            left: 8,
            zIndex: 20,
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.65)',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(8px)',
            color: '#0f172a',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Cards */}
        {slides.map((slide, idx) => {
          const offset = getOffset(idx);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 1;
          const seller = sellers.find((s) => s.id === slide.product.sellerId);

          const translateX = offset * 285;
          const scale = isCenter ? 1 : 0.82;
          const opacity = isVisible ? (isCenter ? 1 : 0.9) : 0;

          return (
            <div
              key={`${slide.word}-${idx}`}
              onClick={() => {
                if (isCenter) onSelectProduct(slide.product);
                else setActiveIdx(idx);
              }}
              style={{
                position: 'absolute',
                width: 'min(300px, 72vw)',
                height: isCenter ? 350 : 300,
                borderRadius: 26,
                backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.28) 0%, rgba(15,23,42,0.12) 45%, rgba(15,23,42,0.72) 100%), url(${slide.product.image || slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff',
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex: isCenter ? 10 : 5,
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, height 0.4s ease',
                boxShadow: isCenter
                  ? '0 22px 44px rgba(15, 23, 42, 0.28)'
                  : '0 10px 24px rgba(15, 23, 42, 0.14)',
                overflow: 'hidden',
              }}
            >
              {/* Top Seller Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                {seller?.verified && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(15,23,42,0.45)',
                      backdropFilter: 'blur(6px)',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    <ShieldCheck size={12} color="#4ade80" /> {seller.name}
                  </span>
                )}
                <strong style={{ fontSize: 15, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  GH₵{slide.product.price.toFixed(2)}
                </strong>
              </div>

              {/* Bold Editorial Word Overlay over Real Food Photo */}
              <div style={{ position: 'relative', display: 'grid', placeItems: 'center', flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: isCenter ? 56 : 42,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: 'rgba(255,255,255,0.92)',
                    textShadow: '0 8px 28px rgba(0,0,0,0.45)',
                    pointerEvents: 'none',
                  }}
                >
                  {slide.word}
                </div>
              </div>

              {/* Bottom Info & Quick Add (full on center card) */}
              <div style={{ zIndex: 2 }}>
                <div style={{ fontWeight: 700, fontSize: isCenter ? 15 : 13, lineHeight: 1.25 }}>
                  {slide.title}
                </div>
                {isCenter && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
                    <span style={{ fontSize: 11, opacity: 0.88 }}>{slide.product.hall}</span>
                    <button
                      type="button"
                      className="btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(slide.product);
                      }}
                      style={{
                        background: '#ffffff',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: 999,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <ShoppingBag size={13} /> Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Right Frosted Arrow */}
        <button
          type="button"
          onClick={goNext}
          aria-label="Next food item"
          style={{
            position: 'absolute',
            right: 8,
            zIndex: 20,
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.65)',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(8px)',
            color: '#0f172a',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Minimal Pill Indicator Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        {slides.map((s, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to ${s.title}`}
            onClick={() => setActiveIdx(idx)}
            style={{
              width: idx === safeIdx ? 28 : 16,
              height: 5,
              borderRadius: 999,
              border: 'none',
              background: idx === safeIdx ? '#334155' : '#cbd5e1',
              transition: 'width 0.25s ease, background 0.25s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
