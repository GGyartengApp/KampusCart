import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Store, ChevronDown, Sparkles } from 'lucide-react';

const CLIP_START = 0.0;

const CALLOUTS = [
  {
    id: 'hat',
    min: 0.08,
    max: 0.24,
    title: 'Knit Bucket Hat',
    price: 'GH₵25.00',
    category: 'Fashion',
    pos: { top: '22%', right: '8%' },
  },
  {
    id: 'jewelry',
    min: 0.25,
    max: 0.43,
    title: 'Silver Necklace & Stacked Rings',
    price: 'GH₵35.00',
    category: 'Fashion',
    pos: { top: '36%', left: '8%' },
  },
  {
    id: 'airpods',
    min: 0.44,
    max: 0.63,
    title: 'AirPods Pro Studio',
    price: 'GH₵249.00',
    category: 'Tech',
    pos: { top: '34%', right: '8%' },
  },
  {
    id: 'sneakers',
    min: 0.64,
    max: 0.84,
    title: 'Streetwear Sneakers',
    price: 'GH₵129.00',
    category: 'Fashion',
    pos: { bottom: '16%', right: '8%' },
  },
  {
    id: 'windbreaker',
    min: 0.85,
    max: 1.0,
    title: 'Colorblock Windbreaker',
    price: 'GH₵68.00',
    category: 'Fashion',
    pos: { top: '28%', left: '8%' },
  },
];

export default function ScrollLookbookHero({ onBrowse, onStartSelling }) {
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const progressRef = useRef(0);
  const isMobile =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768);

  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(isMobile);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let rafId = null;
    let active = true;
    let pauseTimer = null;

    const vid = videoRef.current;
    if (isMobile && vid) {
      vid.muted = true;
      vid.loop = false;
      vid.play().catch(() => { });
    }

    const schedulePause = (delay = 150) => {
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused && !unlocked) {
          videoRef.current.pause();
        }
      }, delay);
    };

    const onWheel = (e) => {
      if (isMobile || unlocked || window.scrollY > 4) return;
      const v = videoRef.current;
      if (!v) return;

      if (e.deltaY > 0) {
        e.preventDefault();
        v.muted = true;
        v.playbackRate = Math.min(2.2, Math.max(1.25, 1.25 + e.deltaY * 0.005));
        if (v.paused) {
          v.play().catch(() => { });
        }
        schedulePause(320);
      } else if (e.deltaY < 0 && progressRef.current > 0) {
        e.preventDefault();
        if (pauseTimer) clearTimeout(pauseTimer);
        if (!v.paused) v.pause();
        v.currentTime = Math.max(CLIP_START, v.currentTime + e.deltaY * 0.004);
      }
    };

    const onTouchStart = () => {
      if (!isMobile || progressRef.current >= 0.995) return;
      // Fallback for mobile browsers (e.g. iOS Low Power Mode) that pause initial autoplay
      const v = videoRef.current;
      if (v && v.paused && !v.ended) {
        v.muted = true;
        v.play().catch(() => { });
      }
    };

    const tick = () => {
      if (!active) return;
      const v = videoRef.current;
      if (v && v.readyState >= 1) {
        const dur = v.duration && !Number.isNaN(v.duration) ? v.duration : 9.0;
        const clipEnd = Math.max(CLIP_START + 1, dur - 0.08);
        const next = Math.min(1, Math.max(0, (v.currentTime - CLIP_START) / (clipEnd - CLIP_START)));
        if (Math.abs(next - progressRef.current) > 0.004) {
          progressRef.current = next;
          setProgress(next);
        }
        if (next >= 0.995) {
          v.pause();
          progressRef.current = 1;
          setProgress(1);
          if (!isMobile) setUnlocked(true);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (pauseTimer) clearTimeout(pauseTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [unlocked, isMobile]);

  const activeCallout = CALLOUTS.find((c) => progress >= c.min && progress <= c.max);
  const introOpacity = Math.max(0, 1 - progress * 5.2);
  const showFinale = isMobile ? progress >= 0.86 : unlocked || progress >= 0.86;

  const handleSkipToStore = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      const dur = vid.duration && !Number.isNaN(vid.duration) ? vid.duration : 9.0;
      vid.currentTime = Math.max(CLIP_START, dur - 0.08);
    }
    progressRef.current = 1;
    setProgress(1);
    setUnlocked(true);
    if (heroRef.current) {
      window.scrollTo({
        top: heroRef.current.offsetTop + heroRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={heroRef}
      className={`lookbook-hero${unlocked ? '' : ' lookbook-hero--locked'}`}
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 70px)',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 60% 35%, #d6cfc3 0%, #8f8678 52%, #24211e 100%)',
      }}
    >
      {/* Fallback image if video fails to load */}
      {videoError && (
        <img
          src="/images/podium/sneakers.jpg"
          alt="KampusCart Campus Lookbook"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Subtle loading indicator behind video until first frame is buffered */}
      {!videoLoaded && !videoError && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            padding: '5px 14px',
            borderRadius: 999,
            background: 'rgba(24, 22, 20, 0.45)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          Loading lookbook…
        </div>
      )}

      {/* Studio Video (auto-plays once on mobile; scroll-driven on desktop; PiP disabled for Edge) */}
      {!videoError && (
        <video
          ref={videoRef}
          className="lookbook-video"
          src="/videos/hero-lookbook.mp4#t=0.001"
          autoPlay={isMobile}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nopictureinpicture"
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = CLIP_START;
          }}
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => {
            setVideoError(true);
            setUnlocked(true);
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 18%',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 1-Tap Skip to Store (always available on mobile, or until unlocked on desktop) */}
      {(isMobile || !unlocked) && (
        <button
          type="button"
          className="lookbook-skip-btn"
          onClick={handleSkipToStore}
          aria-label="Skip lookbook and scroll to store"
        >
          Skip <ChevronDown size={14} />
        </button>
      )}

      {/* Bottom Seam Blend only (no overlay over the video) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 56,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(24,22,20,0) 0%, #181614 100%)',
        }}
      />

      {/* DESIGN & HIGH QUALITY Title Overlay */}
      <div
        className="container lookbook-intro"
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pointerEvents: introOpacity > 0.1 ? 'auto' : 'none',
          opacity: introOpacity,
          transform: `translateY(${-progress * 60}px)`,
          transition: 'opacity 0.08s linear',
        }}
      >
        <div style={{ maxWidth: 560, color: '#ffffff' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.02em',
              marginBottom: 18,
            }}
          >
            <Sparkles size={13} /> Campus Lookbook · Scroll to Play
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(3.3rem, 6vw, 5.2rem)',
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              margin: '0 0 18px',
              color: '#ffffff',
              textShadow: '0 8px 28px rgba(0, 0, 0, 0.22)',
            }}
          >
            Design &amp;
            <br />
            High Quality
          </h1>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15.5,
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.92)',
              lineHeight: 1.6,
              margin: '0 0 28px',
              maxWidth: 460,
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.22)',
            }}
          >
            Your student-verified marketplace for campus fashion, tech, hot meals, and services — scroll to play the lookbook, then explore the store.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onBrowse('All')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 999,
                background: 'rgba(28, 26, 24, 0.92)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.2)',
              }}
            >
              Browse Marketplace <ArrowUpRight size={15} />
            </button>
            <button
              type="button"
              onClick={onStartSelling}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.32)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Store size={15} /> Start Selling Free
            </button>
          </div>
        </div>

        {/* Scroll Prompt */}
        <div
          className="lookbook-scroll-prompt"
          style={{
            position: 'absolute',
            bottom: 26,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffffff',
            background: 'rgba(24, 22, 20, 0.42)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: 999,
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          <span>{unlocked ? 'Explore the store below' : 'Scroll to play lookbook'}</span>
          <ChevronDown size={15} />
        </div>
      </div>

      {/* Interactive Floating Editorial Price Tag */}
      {activeCallout && (
        <div
          key={activeCallout.id}
          className="hero-float-card hero-float-card--callout lookbook-callout"
          style={{
            position: 'absolute',
            zIndex: 5,
            ...activeCallout.pos,
            padding: '15px 18px',
            minWidth: 250,
          }}
        >
          <div
            className="hero-float-card__muted"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                className="hero-float-card__dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              {activeCallout.category}
            </span>
            <span>In Lookbook</span>
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 19,
              fontWeight: 600,
              margin: '6px 0 12px',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {activeCallout.title}
          </div>
          <div
            className="hero-float-card__footer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingTop: 10,
            }}
          >
            <strong
              className="hero-float-card__price"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 19,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {activeCallout.price}
            </strong>
            <button
              type="button"
              onClick={() => onBrowse(activeCallout.category)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '7px 14px',
                borderRadius: 999,
                border: 'none',
                background: 'rgba(28, 26, 24, 0.92)',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Shop <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Pre-Scroll Right-Side Editorial Social Proof Card (fades out as lookbook plays) */}
      <div
        className="hero-float-card hero-float-card--reviews lookbook-reviews"
        style={{
          position: 'absolute',
          right: 'clamp(20px, 5vw, 64px)',
          bottom: 34,
          zIndex: 4,
          opacity: introOpacity,
          transform: `translateY(${progress * 24}px)`,
          pointerEvents: introOpacity > 0.1 ? 'auto' : 'none',
          transition: 'opacity 0.08s linear, background 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          padding: '14px 18px',
          minWidth: 235,
          cursor: 'default',
        }}
      >
        <div
          className="hero-float-card__muted"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.03em',
            marginBottom: 4,
          }}
        >
          Campus Verified Reviews
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="hero-float-card__stars" style={{ fontSize: 14, letterSpacing: '0.08em' }}>
            ★★★★★
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            4.9
          </span>
        </div>
        <div
          className="hero-float-card__muted"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
          }}
        >
          528+ Student Reviews · 5 Lookbook Pieces
        </div>
      </div>
      {/* Post-Video Animated Right-Side Editorial Text Section */}
      <div
        className={`lookbook-finale${showFinale ? ' lookbook-finale--visible' : ''}`}
        style={{
          position: 'absolute',
          right: 'clamp(24px, 6vw, 72px)',
          top: '50%',
          transform: showFinale
            ? 'translateY(-50%) translateX(0)'
            : 'translateY(-50%) translateX(32px)',
          opacity: showFinale ? 1 : 0,
          pointerEvents: showFinale ? 'auto' : 'none',
          transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 5,
          maxWidth: 380,
          background: 'rgba(24, 22, 20, 0.54)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255, 255, 255, 0.24)',
          borderRadius: 22,
          padding: '26px 28px',
          color: '#ffffff',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.14)',
            border: '1px solid rgba(255, 255, 255, 0.24)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.04em',
            marginBottom: 14,
          }}
        >
          <Sparkles size={12} /> The Complete Look
        </span>

        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.85rem, 2.8vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
            color: '#ffffff',
          }}
        >
          Curated for
          <br />
          Campus Life
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.88)',
            margin: '0 0 20px',
          }}
        >
          Every piece in this lookbook is listed by verified students on campus — shop the full outfit or scroll down to explore the marketplace.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onBrowse('Fashion')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(28, 26, 24, 0.92)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Shop the Look <ArrowUpRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => onBrowse('All')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Explore All
          </button>
        </div>
      </div>
    </section>
  );
}
