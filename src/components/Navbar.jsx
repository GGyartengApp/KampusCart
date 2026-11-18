import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  ChevronDown,
  Bell,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { CATEGORIES, HALLS } from '../data/mockData';
import ProductIllustration from './ProductIllustration';

export default function Navbar({
  activePage,
  setActivePage,
  selectedCategory,
  setSelectedCategory,
  selectedHall,
  setSelectedHall,
  searchQuery,
  setSearchQuery,
  products,
  cartCount,
  wishlistCount,
  notifications,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onSelectProduct,
  user,
  role,
  setRole,
  onMarkNotificationsRead,
}) {
  const [showMega, setShowMega] = useState(false);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const searchMatches = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.status === 'approved' &&
            (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setActivePage('marketplace');
    setShowMega(false);
    setMobileMenu(false);
  };

  return (
    <>
      {/* Shopcart-style Top Announcement Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Phone size={12} /> Campus Support: +233-55-019-CAMPUS
            </span>
          </div>

          <div className="top-bar-center">
            <span>Get 25% Off with code CAMPUS25</span>
            <span>|</span>
            <button
              type="button"
              className="top-bar-link"
              onClick={() => setActivePage('marketplace')}
            >
              Shop Now
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} />
              <select
                aria-label="Campus Hall"
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {HALLS.map((h) => (
                  <option key={h} value={h} style={{ color: '#18181b' }}>
                    {h}
                  </option>
                ))}
              </select>
            </span>

            {/* Quick Role Switcher for Demoing Buyer / Seller / Admin */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.14)', padding: '2px 6px', borderRadius: 999 }}>
              <span style={{ fontSize: 10, opacity: 0.85 }}>View:</span>
              {['buyer', 'seller', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (r === 'seller') setActivePage('seller');
                    else if (r === 'admin') setActivePage('admin');
                    else setActivePage('home');
                  }}
                  style={{
                    border: 'none',
                    borderRadius: 999,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    background: role === r ? '#facc15' : 'transparent',
                    color: role === r ? '#0e3329' : '#ffffff',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="main-header">
        <div className="container header-inner">
          <button
            type="button"
            className="brand-logo"
            onClick={() => setActivePage('home')}
          >
            <div className="brand-icon">KC</div>
            <div>
              <div className="brand-name">KampusCart</div>
              <div className="brand-tag">Student Marketplace</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="nav-links" aria-label="Primary">
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`nav-btn ${activePage === 'marketplace' ? 'active' : ''}`}
                onClick={() => setShowMega((s) => !s)}
              >
                Categories <ChevronDown size={15} />
              </button>

              {showMega && (
                <div className="mega-dropdown">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong style={{ fontSize: 14 }}>Popular Campus Categories</strong>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('All')}
                      style={{ background: 'none', border: 'none', color: '#0b462d', fontWeight: 700, fontSize: 12 }}
                    >
                      View All →
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: 10,
                          borderRadius: 10,
                          border: '1px solid #f1f5f9',
                          background: selectedCategory === cat.id ? '#ecfdf5' : '#f8fafc',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ width: 42, height: 42, borderRadius: 8, background: cat.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <ProductIllustration art={cat.art} color={cat.color} accent={cat.accent} size={34} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{cat.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{cat.count}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`nav-btn ${activePage === 'marketplace' ? 'active' : ''}`}
              onClick={() => setActivePage('marketplace')}
            >
              Browse
            </button>
            <button
              type="button"
              className={`nav-btn ${activePage === 'orders' ? 'active' : ''}`}
              onClick={() => setActivePage('orders')}
            >
              Orders
            </button>
            <button
              type="button"
              className={`nav-btn ${activePage === 'seller' ? 'active' : ''}`}
              onClick={() => setActivePage('seller')}
            >
              <Store size={14} /> Sell
            </button>
            <button
              type="button"
              className={`nav-btn ${activePage === 'about' ? 'active' : ''}`}
              onClick={() => setActivePage('about')}
            >
              How It Works
            </button>
            <button
              type="button"
              className={`nav-btn ${activePage === 'admin' ? 'active' : ''}`}
              onClick={() => setActivePage('admin')}
            >
              <LayoutDashboard size={14} /> Admin
            </button>
          </nav>

          {/* Instant Search Bar (Shopcart video 00:03) */}
          <div className="header-search-wrap">
            <input
              type="text"
              className="header-search-input"
              placeholder="Search food, tech, tutors, shoes..."
              value={searchQuery}
              onFocus={() => setShowSearchDrop(true)}
              onBlur={() => setTimeout(() => setShowSearchDrop(false), 180)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDrop(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActivePage('marketplace');
                  setShowSearchDrop(false);
                }
              }}
            />
            <Search size={16} className="header-search-icon" />

            {showSearchDrop && searchMatches.length > 0 && (
              <div className="search-dropdown">
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                  INSTANT CAMPUS RESULTS
                </div>
                {searchMatches.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={() => {
                      onSelectProduct(item);
                      setShowSearchDrop(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '8px 6px',
                      border: 'none',
                      borderBottom: '1px solid #f1f5f9',
                      background: 'transparent',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f7f7f7', display: 'grid', placeItems: 'center' }}>
                        <ProductIllustration art={item.art} color={item.colors[0]} size={30} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          {item.category} • {item.hall}
                        </div>
                      </div>
                    </div>
                    <strong style={{ fontSize: 13, color: '#0b462d' }}>${item.price.toFixed(2)}</strong>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Pills */}
          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="icon-pill-btn"
                aria-label="Notifications"
                onClick={() => {
                  setShowNotifs((s) => !s);
                  if (!showNotifs) onMarkNotificationsRead();
                }}
              >
                <Bell size={16} />
                {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
              </button>

              {showNotifs && (
                <div className="search-dropdown" style={{ right: 0, left: 'auto', width: 310 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Campus Notifications</div>
                  {notifications.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#64748b' }}>You are all caught up!</div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                        <div style={{ color: '#64748b', marginTop: 2 }}>{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="icon-pill-btn"
              aria-label="Wishlist"
              onClick={onOpenWishlist}
            >
              <Heart size={16} />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </button>

            <button
              type="button"
              className="icon-pill-btn"
              onClick={onOpenCart}
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              <span>Cart</span>
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </button>

            <button
              type="button"
              className="icon-pill-btn"
              onClick={onOpenAuth}
              style={{
                background: user ? '#ecfdf5' : '#ffffff',
                borderColor: user ? '#a7f3d0' : '#e5e7eb',
              }}
            >
              {user ? <ShieldCheck size={16} color="#047857" /> : <User size={16} />}
              <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user ? user.name.split(' ')[0] : 'Student ID'}
              </span>
            </button>

            <button
              type="button"
              className="icon-pill-btn"
              onClick={() => setMobileMenu((m) => !m)}
              aria-label="Mobile menu"
              style={{ display: 'inline-flex' }}
            >
              {mobileMenu ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenu && (
          <div style={{ borderTop: '1px solid #e5e7eb', padding: 16, background: '#fff' }}>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search campus marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'marketplace', label: 'Browse' },
                { id: 'orders', label: 'Orders' },
                { id: 'seller', label: 'Seller Hub' },
                { id: 'admin', label: 'Admin Panel' },
                { id: 'about', label: 'How It Works & FAQ' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenu(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
