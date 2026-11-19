import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES, HALLS, FACULTIES, DELIVERY_OPTIONS } from '../data/mockData';
import ProductCard from './ProductCard';
import ProductIllustration from './ProductIllustration';
import CategoryHangerHero from './CategoryHangerHero';
import FoodCarouselHero from './FoodCarouselHero';

export default function Marketplace({
  products,
  sellers,
  selectedCategory,
  setSelectedCategory,
  selectedHall,
  setSelectedHall,
  searchQuery,
  setSearchQuery,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) {
  const [faculty, setFaculty] = useState('All Faculties');
  const [priceRange, setPriceRange] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [delivery, setDelivery] = useState('All Delivery');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const getSeller = (id) => sellers.find((s) => s.id === id);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status === 'approved');

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedHall !== 'All Halls') {
      list = list.filter((p) => p.hall === selectedHall);
    }
    if (faculty !== 'All Faculties') {
      list = list.filter((p) => p.faculty === faculty);
    }
    if (delivery !== 'All Delivery') {
      list = list.filter((p) => p.deliveryOption === delivery);
    }
    if (priceRange === 'under20') {
      list = list.filter((p) => p.price < 20);
    } else if (priceRange === '20to100') {
      list = list.filter((p) => p.price >= 20 && p.price <= 100);
    } else if (priceRange === 'over100') {
      list = list.filter((p) => p.price > 100);
    }
    if (minRating === '4.5') {
      list = list.filter((p) => p.rating >= 4.5);
    } else if (minRating === '4.8') {
      list = list.filter((p) => p.rating >= 4.8);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.hall.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));

    return list;
  }, [products, selectedCategory, selectedHall, faculty, delivery, priceRange, minRating, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedHall('All Halls');
    setFaculty('All Faculties');
    setPriceRange('All');
    setMinRating('All');
    setDelivery('All Delivery');
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* Interactive Heroes: Food 3-Card Spotlight, Fashion/Tech 3D Carousel, or Cream Promo Strip */}
      {selectedCategory === 'Food' ? (
        <FoodCarouselHero
          foodProducts={products.filter(
            (p) => p.status === 'approved' && p.category === 'Food'
          )}
          sellers={sellers}
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
        />
      ) : ['Fashion', 'Tech'].includes(selectedCategory) ? (
        <CategoryHangerHero
          category={selectedCategory}
          fashionProducts={(() => {
            if (selectedCategory === 'Fashion') {
              const shirts = products.filter(
                (p) => p.status === 'approved' && p.category === 'Fashion' && p.art === 'shirt'
              );
              return shirts.length > 0
                ? shirts
                : products.filter((p) => p.status === 'approved' && p.category === 'Fashion');
            }
            return products.filter(
              (p) => p.status === 'approved' && p.category === selectedCategory
            );
          })()}
          sellers={sellers}
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
        />
      ) : (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 28,
            padding: '26px 30px',
            borderRadius: 22,
            border: '3px solid #111827',
            background: '#facc15',
            boxShadow: '0 14px 32px rgba(15, 23, 42, 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {/* Comic-Style Explosion Graffiti Background */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 260"
            preserveAspectRatio="xMidYMid slice"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <pattern id="comicHalftone" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="2.2" fill="rgba(17,24,39,0.14)" />
              </pattern>
            </defs>
            <rect width="1200" height="260" fill="#fde047" />
            <rect width="1200" height="260" fill="url(#comicHalftone)" />

            {/* Comic starburst explosion rays */}
            <polygon points="600,130 0,0 180,0" fill="#fb923c" />
            <polygon points="600,130 320,0 470,0" fill="#ec4899" />
            <polygon points="600,130 640,0 810,0" fill="#22d3ee" />
            <polygon points="600,130 960,0 1160,0" fill="#a3e635" />
            <polygon points="600,130 1200,50 1200,185" fill="#f97316" />
            <polygon points="600,130 1080,260 880,260" fill="#ec4899" />
            <polygon points="600,130 690,260 510,260" fill="#38bdf8" />
            <polygon points="600,130 310,260 110,260" fill="#a3e635" />
            <polygon points="600,130 0,210 0,90" fill="#22d3ee" />

            {/* Jagged comic boom burst */}
            <polygon
              points="180,32 235,62 295,22 330,72 410,48 415,96 485,105 435,152 480,205 405,212 370,252 305,218 245,254 205,205 130,224 148,164 85,132 142,92"
              fill="#f97316"
              stroke="#111827"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <polygon
              points="760,26 820,58 885,18 920,66 1005,40 1010,94 1085,112 1030,156 1072,212 990,216 955,252 888,216 825,248 790,198 720,208 745,154 685,120 742,84"
              fill="#ec4899"
              stroke="#111827"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Graffiti paint drips & pop-art stars */}
            <circle cx="95" cy="54" r="16" fill="#22d3ee" stroke="#111827" strokeWidth="4" />
            <circle cx="565" cy="48" r="14" fill="#a3e635" stroke="#111827" strokeWidth="4" />
            <circle cx="640" cy="216" r="18" fill="#facc15" stroke="#111827" strokeWidth="4" />
            <circle cx="1135" cy="64" r="15" fill="#38bdf8" stroke="#111827" strokeWidth="4" />
            <path d="M510 18 L525 52 L560 54 L532 76 L542 110 L510 90 L478 110 L488 76 L460 54 L495 52 Z" fill="#fde047" stroke="#111827" strokeWidth="4" strokeLinejoin="round" />
          </svg>

          {/* High-contrast comic text box inside the explosion */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2.5px solid #111827',
              borderRadius: 16,
              padding: '16px 22px',
              boxShadow: '5px 5px 0 #111827',
              maxWidth: 640,
            }}
          >
            <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.35rem, 2.7vw, 1.95rem)', color: '#111827', fontWeight: 800 }}>
              Grab Upto 50% Off On Campus Essentials
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#334155', fontWeight: 500 }}>
              Filter by your Hall, Faculty, Price, Rating, or Delivery Option. Verified student sellers only.
            </p>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          type="button"
          className={`btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setSelectedCategory('All');
            setPage(1);
          }}
        >
          All Categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setSelectedCategory(c.id);
              setPage(1);
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Shopcart Filter Pills Bar */}
      <div className="filter-bar">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#475569' }}>
          <SlidersHorizontal size={14} /> Filters:
        </span>

        <select
          aria-label="Filter by Hall"
          className="filter-select"
          value={selectedHall}
          onChange={(e) => {
            setSelectedHall(e.target.value);
            setPage(1);
          }}
        >
          {HALLS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <select
          aria-label="Filter by Faculty"
          className="filter-select"
          value={faculty}
          onChange={(e) => {
            setFaculty(e.target.value);
            setPage(1);
          }}
        >
          {FACULTIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select
          aria-label="Filter by Price"
          className="filter-select"
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">Price: Any</option>
          <option value="under20">Under $20</option>
          <option value="20to100">$20 – $100</option>
          <option value="over100">Over $100</option>
        </select>

        <select
          aria-label="Filter by Rating"
          className="filter-select"
          value={minRating}
          onChange={(e) => {
            setMinRating(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">Rating: All</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4.8">4.8+ Stars</option>
        </select>

        <select
          aria-label="Filter by Delivery"
          className="filter-select"
          value={delivery}
          onChange={(e) => {
            setDelivery(e.target.value);
            setPage(1);
          }}
        >
          {DELIVERY_OPTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          aria-label="Sort products"
          className="filter-select"
          style={{ marginLeft: 'auto', background: '#ffffff', border: '1px solid #cbd5e1' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        <button type="button" className="btn-outline btn-sm" onClick={resetFilters}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Results Header */}
      <div className="section-head">
        <h2 className="section-title">
          {selectedCategory === 'All' ? 'Campus Picks For You!' : `${selectedCategory} For You!`}
        </h2>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          Showing {filtered.length} verified listing{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {paginated.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 20px', background: '#f8fafc', borderRadius: 18 }}>
          <h3 style={{ margin: '0 0 8px' }}>No matching campus items found</h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
            Try clearing a hall, faculty, or price filter.
          </p>
          <button type="button" className="btn-primary btn-sm" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {paginated.map((product) => (
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
      )}

      {/* Pagination (Shopcart video 00:08) */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #cbd5e1',
                background: safePage === n ? '#0b462d' : '#ffffff',
                color: safePage === n ? '#ffffff' : '#18181b',
                fontWeight: 700,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
