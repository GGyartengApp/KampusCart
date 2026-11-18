import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { getShirtDecalTexture } from '../utils/shirtDesigns';
import EmptyShirtGarment from './EmptyShirtGarment';
import CarouselItem3D from './CarouselItem3D';

const TECH_RACK_CATALOG = [
  {
    productId: 'prod-1',
    modelType: 'headphones',
    color: '#e11d48',
    title: 'AirPods Max Studio Edition',
    desc: 'Spatial audio & active noise cancellation built for quiet library study.',
    bannerBg: 'linear-gradient(125deg, #1e1b4b 0%, #312e81 55%, #881337 100%)',
    pillBg: 'rgba(251, 113, 133, 0.2)',
    pillColor: '#fda4af',
    patternType: 'waves',
  },
  {
    productId: 'prod-3',
    modelType: 'earbuds',
    color: '#0f172a',
    title: 'Wireless Earbuds IPX8',
    desc: 'Sweatproof 32-hour battery earbuds for gym & Zoom group meetings.',
    bannerBg: 'linear-gradient(125deg, #042f2e 0%, #0f766e 55%, #115e59 100%)',
    pillBg: 'rgba(52, 211, 153, 0.2)',
    pillColor: '#6ee7b7',
    patternType: 'grid',
  },
  {
    productId: 'prod-8',
    modelType: 'laptop',
    color: '#475569',
    title: 'MacBook 14" Felt Sleeve',
    desc: 'Water-resistant wool felt sleeve with magnetic charger pocket.',
    bannerBg: 'linear-gradient(125deg, #0f172a 0%, #1e293b 55%, #b45309 100%)',
    pillBg: 'rgba(251, 191, 36, 0.2)',
    pillColor: '#fde68a',
    patternType: 'stripes',
  },
  {
    productId: 'prod-1',
    modelType: 'headphones',
    color: '#0b462d',
    title: 'AirPods Max Forest Edition',
    desc: 'Emerald colorway with memory-foam cushions & USB-C fast charge.',
    bannerBg: 'linear-gradient(125deg, #0e3329 0%, #133c31 55%, #1d5243 100%)',
    pillBg: 'rgba(250, 204, 21, 0.2)',
    pillColor: '#fde047',
    patternType: 'dots',
  },
];

const FOOD_RACK_CATALOG = [
  {
    productId: 'prod-4',
    modelType: 'jollof',
    color: '#ea580c',
    title: 'Smoky Jollof & Chicken Bowl',
    desc: 'Hot party-style jollof, grilled spicy chicken & sweet plantain.',
    bannerBg: 'linear-gradient(125deg, #431407 0%, #9a3412 55%, #c2410c 100%)',
    pillBg: 'rgba(254, 240, 138, 0.22)',
    pillColor: '#fef08a',
    patternType: 'waves',
  },
  {
    productId: 'prod-11',
    modelType: 'boba',
    color: '#16a34a',
    title: 'Boba & Iced Matcha Study Duo',
    desc: '2 large cold-brew matcha & brown sugar boba teas delivered to your hall.',
    bannerBg: 'linear-gradient(125deg, #064e3b 0%, #047857 55%, #92400e 100%)',
    pillBg: 'rgba(167, 243, 208, 0.2)',
    pillColor: '#a7f3d0',
    patternType: 'dots',
  },
  {
    productId: 'prod-4',
    modelType: 'jollof',
    color: '#dc2626',
    title: 'Late-Night Jollof Express',
    desc: 'Freshly packed insulated meal bowl — ready in 20 minutes.',
    bannerBg: 'linear-gradient(125deg, #450a0a 0%, #7f1d1d 55%, #b45309 100%)',
    pillBg: 'rgba(253, 224, 71, 0.2)',
    pillColor: '#fde047',
    patternType: 'stripes',
  },
];

const SHIRT_RACK_CATALOG = [
  {
    designId: 'just-do-it',
    title: 'Just Do It Classic Tee',
    desc: 'Jet-black heavyweight cotton tee with crisp white chest slogan.',
    shirtColor: '#18181b',
    bannerBg: 'linear-gradient(125deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
    pillBg: 'rgba(255,255,255,0.16)',
    pillColor: '#f8fafc',
    patternType: 'stripes',
  },
  {
    designId: 'adventure-pine',
    title: 'Adventure Pine & Moon Tee',
    desc: 'Espresso brown cotton tee with mountain, pines & stencil print.',
    shirtColor: '#362823',
    bannerBg: 'linear-gradient(125deg, #271b16 0%, #432e24 55%, #5c3f31 100%)',
    pillBg: 'rgba(132, 204, 22, 0.2)',
    pillColor: '#bef264',
    patternType: 'waves',
  },
  {
    designId: 'air-red',
    title: 'Air Crimson Silhouette Tee',
    desc: 'Midnight black streetwear tee with bold crimson court emblem.',
    shirtColor: '#141416',
    bannerBg: 'linear-gradient(125deg, #18181b 0%, #450a0a 55%, #7f1d1d 100%)',
    pillBg: 'rgba(248, 113, 113, 0.2)',
    pillColor: '#fca5a5',
    patternType: 'grid',
  },
  {
    designId: 'adventure-begins',
    title: 'Adventure Begins Crest Tee',
    desc: 'Charcoal black tee featuring teal & sun-gold outdoor badge.',
    shirtColor: '#1e2224',
    bannerBg: 'linear-gradient(125deg, #042f2e 0%, #115e59 55%, #0f766e 100%)',
    pillBg: 'rgba(253, 224, 71, 0.2)',
    pillColor: '#fde047',
    patternType: 'waves',
  },
  {
    designId: 'jordan-type',
    title: 'Jordan Air Typographic Tee',
    desc: 'Oversized campus fit with bold white block lettering & red crest.',
    shirtColor: '#161618',
    bannerBg: 'linear-gradient(125deg, #09090b 0%, #27272a 55%, #7f1d1d 100%)',
    pillBg: 'rgba(255,255,255,0.16)',
    pillColor: '#fca5a5',
    patternType: 'stripes',
  },
  {
    designId: 'mountain-sunset',
    title: 'Mountain Sunset Calling Tee',
    desc: 'Heather white tee with retro sunset stripes & mountain emblem.',
    shirtColor: '#e5e7eb',
    bannerBg: 'linear-gradient(125deg, #1e293b 0%, #0f4c5c 55%, #b45309 100%)',
    pillBg: 'rgba(251, 191, 36, 0.22)',
    pillColor: '#fde68a',
    patternType: 'dots',
  },
  {
    designId: 'just-do-it',
    title: 'Just Do It Forest Edition',
    desc: 'Deep forest green cotton tee with crisp white chest slogan.',
    shirtColor: '#133c31',
    bannerBg: 'linear-gradient(125deg, #0e3329 0%, #133c31 55%, #1f5c4b 100%)',
    pillBg: 'rgba(250, 204, 21, 0.18)',
    pillColor: '#fde047',
    patternType: 'waves',
  },
  {
    designId: 'adventure-begins',
    title: 'Adventure Cobalt Edition',
    desc: 'Deep cobalt cotton tee with outdoor mountain crest.',
    shirtColor: '#1e3a8a',
    bannerBg: 'linear-gradient(125deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
    pillBg: 'rgba(245, 158, 11, 0.2)',
    pillColor: '#fcd34d',
    patternType: 'grid',
  },
];

useGLTF.preload('/models/shirt_baked.glb');

function BackgroundPattern({ type }) {
  if (type === 'waves') {
    return (
      <svg className="rack-pattern-svg" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 Q 200 40 400 120 T 800 120" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="2" />
        <path d="M0 180 Q 200 100 400 180 T 800 180" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
        <path d="M0 240 Q 200 160 400 240 T 800 240" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <circle cx="670" cy="80" r="110" fill="rgba(250,204,21,0.06)" />
      </svg>
    );
  }
  if (type === 'stripes') {
    return (
      <svg className="rack-pattern-svg" width="100%" height="100%" aria-hidden="true">
        <defs>
          <pattern id="diagStripes" width="28" height="28" patternTransform="rotate(35)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="28" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagStripes)" />
      </svg>
    );
  }
  if (type === 'grid') {
    return (
      <svg className="rack-pattern-svg" width="100%" height="100%" aria-hidden="true">
        <defs>
          <pattern id="fashionGrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fashionGrid)" />
      </svg>
    );
  }
  return (
    <svg className="rack-pattern-svg" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id="fashionDots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.1)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fashionDots)" />
    </svg>
  );
}

function RealisticHanger3D() {
  const { hookGeo, archGeo } = useMemo(() => {
    const hookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.14, 0),
      new THREE.Vector3(0, -0.04, 0),
      new THREE.Vector3(-0.04, 0.045, 0),
      new THREE.Vector3(0.01, 0.075, 0),
      new THREE.Vector3(0.055, 0.04, 0),
      new THREE.Vector3(0.045, -0.01, 0),
    ]);
    const hGeo = new THREE.TubeGeometry(hookCurve, 28, 0.011, 12, false);

    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.44, -0.31, 0),
      new THREE.Vector3(-0.22, -0.21, 0),
      new THREE.Vector3(0, -0.15, 0),
      new THREE.Vector3(0.22, -0.21, 0),
      new THREE.Vector3(0.44, -0.31, 0),
    ]);
    const aGeo = new THREE.TubeGeometry(archCurve, 32, 0.022, 12, false);
    return { hookGeo: hGeo, archGeo: aGeo };
  }, []);

  return (
    <group>
      <mesh geometry={hookGeo} castShadow>
        <meshStandardMaterial color="#e2e8f0" metalness={0.94} roughness={0.14} />
      </mesh>
      <mesh position={[0, -0.14, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 0.03, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh geometry={archGeo} castShadow>
        <meshStandardMaterial color="#8c5828" roughness={0.42} metalness={0.04} />
      </mesh>
    </group>
  );
}

function HangerRod3D() {
  return (
    <group position={[0, 1.35, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} receiveShadow>
        <cylinderGeometry args={[0.036, 0.036, 14, 32]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.96} roughness={0.12} />
      </mesh>
    </group>
  );
}

export default function CategoryHangerHero({
  category = 'Fashion',
  fashionProducts = [],
  sellers,
  onAddToCart,
  onSelectProduct,
}) {
  // Build 3D carousel entries for Fashion, Tech, or Food
  const rackItems = useMemo(() => {
    if (fashionProducts.length === 0) return [];
    if (category === 'Tech') {
      return TECH_RACK_CATALOG.map((design, idx) => ({
        rackKey: `tech-${idx}`,
        product: fashionProducts.find((p) => p.id === design.productId) || fashionProducts[idx % fashionProducts.length],
        design,
      }));
    }
    if (category === 'Food') {
      return FOOD_RACK_CATALOG.map((design, idx) => ({
        rackKey: `food-${idx}`,
        product: fashionProducts.find((p) => p.id === design.productId) || fashionProducts[idx % fashionProducts.length],
        design,
      }));
    }
    return SHIRT_RACK_CATALOG.map((design, idx) => ({
      rackKey: `${design.designId}-${idx}`,
      product: fashionProducts[idx % fashionProducts.length],
      design,
    }));
  }, [category, fashionProducts]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false
  );
  const dragStartX = useRef(null);
  const didDrag = useRef(false);

  useEffect(() => {
    setActiveIdx(0);
  }, [category]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (rackItems.length === 0) return null;

  const activeEntry = rackItems[activeIdx] || rackItems[0];
  const activeItem = activeEntry.product;
  const activeDesign = activeEntry.design;
  const seller = sellers.find((s) => s.id === activeItem.sellerId);

  const goNext = () => setActiveIdx((i) => (i + 1) % rackItems.length);
  const goPrev = () => setActiveIdx((i) => (i - 1 + rackItems.length) % rackItems.length);

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    didDrag.current = false;
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 6) didDrag.current = true;
    setDragProgress(THREE.MathUtils.clamp(dx / 130, -1, 1));
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (dx < -45) {
      goNext();
    } else if (dx > 45) {
      goPrev();
    }
    dragStartX.current = null;
    setDragProgress(0);
  };

  return (
    <section
      className="hanger-hero-banner"
      style={{
        background: activeDesign.bannerBg,
        color: '#ffffff',
      }}
    >
      <BackgroundPattern type={activeDesign.patternType} />

      {/* Full-Width 3D Rack Canvas extending across the entire hero */}
      <div
        className="hanger-canvas-full"
        style={{
          cursor: dragStartX.current !== null ? 'grabbing' : 'grab',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Canvas shadows camera={{ position: [0, 0.02, 4.05], fov: 38 }} dpr={[1, 2]}>
          <ambientLight intensity={0.45} />
          <spotLight
            position={[3.2, 5.5, 4.5]}
            angle={0.45}
            penumbra={0.65}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0004}
          />
          <directionalLight position={[-3.5, 2.5, 2]} intensity={0.6} />
          <directionalLight position={[0, -2, 3]} intensity={0.35} />
          <Suspense fallback={null}>
            {rackItems.map((entry, idx) =>
              category === 'Fashion' ? (
                <EmptyShirtGarment
                  key={entry.rackKey}
                  shirtColor={entry.design.shirtColor}
                  designId={entry.design.designId}
                  offset={idx - activeIdx}
                  dragProgress={dragProgress}
                  isMobile={isMobile}
                  onClick={() => {
                    if (!didDrag.current) setActiveIdx(idx);
                  }}
                />
              ) : (
                <CarouselItem3D
                  key={entry.rackKey}
                  modelType={entry.design.modelType}
                  color={entry.design.color}
                  offset={idx - activeIdx}
                  dragProgress={dragProgress}
                  isMobile={isMobile}
                  onClick={() => {
                    if (!didDrag.current) setActiveIdx(idx);
                  }}
                />
              )
            )}
            <ContactShadows position={[0, -1.25, 0]} opacity={0.42} scale={8} blur={2.4} />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>

      {/* Smooth Right-Side Fade Scrim so the rack fades into the description */}
      <div className="hanger-fade-scrim" aria-hidden="true" />

      {/* Top Overlay Header + Right-Side Translucent Item Description */}
      <div className="hanger-overlay-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              background: activeDesign.pillBg,
              color: activeDesign.pillColor,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Sparkles size={13} /> 3D {category.toUpperCase()} CAROUSEL
          </span>

          <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.92 }}>
            {activeIdx + 1} / {rackItems.length} — Drag or click Next
          </span>
        </div>

        <div key={activeEntry.rackKey} className="hanger-info-card hanger-info-overlay">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {seller?.verified && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(255,255,255,0.16)',
                    padding: '3px 9px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={12} color="#4ade80" /> {seller.name} • {activeItem.hall}
                </span>
              )}
              <span style={{ fontSize: 12, opacity: 0.85 }}>{activeItem.deliveryOption}</span>
            </div>

            <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(1.5rem, 2.8vw, 2.15rem)', lineHeight: 1.15 }}>
              {activeDesign.title}
            </h2>
            <p style={{ margin: '0 0 14px', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
              {activeDesign.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
              <strong style={{ fontSize: 26, color: activeDesign.pillColor }}>${activeItem.price.toFixed(2)}</strong>
              {activeItem.originalPrice > activeItem.price && (
                <span style={{ textDecoration: 'line-through', opacity: 0.65, fontSize: 14 }}>
                  ${activeItem.originalPrice.toFixed(2)}
                </span>
              )}
              <span style={{ fontSize: 12, opacity: 0.85 }}>({activeItem.stock} in stock)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn-orange" onClick={() => onAddToCart(activeItem)}>
                <ShoppingBag size={15} /> Add to Cart
              </button>
              <button
                type="button"
                className="btn-outline"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
                onClick={() => onSelectProduct(activeItem)}
              >
                View Details <ArrowUpRight size={15} />
              </button>

              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous item on rack"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.4)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next item on rack"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.4)',
                    background: '#ffffff',
                    color: '#0f172a',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
