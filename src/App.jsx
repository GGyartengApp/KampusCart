import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  INITIAL_REVIEWS,
  INITIAL_PROMO_CODES,
  INITIAL_ORDERS,
  INITIAL_PENDING_SELLERS,
  INITIAL_DISPUTES,
  INITIAL_PARTNERSHIPS,
} from './data/mockData';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HomeSections from './components/HomeSections';
import Marketplace from './components/Marketplace';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersAndTracking from './components/OrdersAndTracking';
import SellerDashboard from './components/SellerDashboard';
import AdminPanel from './components/AdminPanel';
import PublicPages from './components/PublicPages';
import AuthModal from './components/AuthModal';
import ChatDrawer from './components/ChatDrawer';
import Footer from './components/Footer';

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadMergedProducts() {
  const saved = loadState('kc_products', null);
  if (!Array.isArray(saved)) return INITIAL_PRODUCTS;
  const defaultsById = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
  const hydrated = saved.map((p) => {
    const def = defaultsById.get(p.id);
    return def && !p.image && def.image ? { ...p, image: def.image } : p;
  });
  const savedIds = new Set(hydrated.map((p) => p.id));
  const missing = INITIAL_PRODUCTS.filter((p) => !savedIds.has(p.id));
  return [...hydrated, ...missing];
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [role, setRole] = useState('buyer');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHall, setSelectedHall] = useState('All Halls');
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState(() => loadState('kc_user', null));
  const [products, setProducts] = useState(loadMergedProducts);
  const [sellers, setSellers] = useState(() => loadState('kc_sellers', INITIAL_SELLERS));
  const [pendingSellers, setPendingSellers] = useState(() =>
    loadState('kc_pending_sellers', INITIAL_PENDING_SELLERS)
  );
  const [reviews, setReviews] = useState(() => loadState('kc_reviews', INITIAL_REVIEWS));
  const [promoCodes, setPromoCodes] = useState(() => loadState('kc_promos', INITIAL_PROMO_CODES));
  const [orders, setOrders] = useState(() => loadState('kc_orders', INITIAL_ORDERS));
  const [disputes, setDisputes] = useState(() => loadState('kc_disputes', INITIAL_DISPUTES));
  const [partnerships, setPartnerships] = useState(() =>
    loadState('kc_partnerships', INITIAL_PARTNERSHIPS)
  );
  const [cart, setCart] = useState(() => loadState('kc_cart', []));
  const [wishlist, setWishlist] = useState(() => loadState('kc_wishlist', ['prod-1', 'prod-2']));
  const [chatMessages, setChatMessages] = useState(() => loadState('kc_chats', {}));
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Order #KC-99024 is out for campus meet-up!', time: '10 mins ago', read: false },
    { id: 'n2', title: 'Use code CAMPUS25 for 25% off verified drops.', time: '1 hour ago', read: false },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [chatState, setChatState] = useState({ isOpen: false, seller: null, product: null });
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('kc_user', JSON.stringify(user));
      localStorage.setItem('kc_products', JSON.stringify(products));
      localStorage.setItem('kc_sellers', JSON.stringify(sellers));
      localStorage.setItem('kc_pending_sellers', JSON.stringify(pendingSellers));
      localStorage.setItem('kc_reviews', JSON.stringify(reviews));
      localStorage.setItem('kc_promos', JSON.stringify(promoCodes));
      localStorage.setItem('kc_orders', JSON.stringify(orders));
      localStorage.setItem('kc_disputes', JSON.stringify(disputes));
      localStorage.setItem('kc_partnerships', JSON.stringify(partnerships));
      localStorage.setItem('kc_cart', JSON.stringify(cart));
      localStorage.setItem('kc_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('kc_chats', JSON.stringify(chatMessages));
    } catch {
      // ignore storage quota errors
    }
  }, [user, products, sellers, pendingSellers, reviews, promoCodes, orders, disputes, partnerships, cart, wishlist, chatMessages]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addNotification = (title) => {
    setNotifications((prev) => [{ id: `n-${Date.now()}`, title, time: 'Just now', read: false }, ...prev]);
  };

  const handleBrowseCategory = (cat) => {
    setSelectedCategory(cat);
    setActivePage('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      notify(exists ? 'Removed from wishlist' : 'Saved to wishlist');
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const handleAddToCart = (product, qty = 1, colorName) => {
    const chosenColor = colorName || product.colorNames?.[0] || 'Standard';
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id && i.colorName === chosenColor);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          qty,
          sellerId: product.sellerId,
          colorName: chosenColor,
          art: product.art,
          color: product.colors[0] || '#0b462d',
        },
      ];
    });
    notify(`Added ${product.title} to cart`);
  };

  const handleBuyNow = (product, qty = 1, colorName) => {
    const chosenColor = colorName || product.colorNames?.[0] || 'Standard';
    setSelectedProduct(null);
    setCheckoutItems([
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        qty,
        sellerId: product.sellerId,
        colorName: chosenColor,
        art: product.art,
        color: product.colors[0] || '#0b462d',
      },
    ]);
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = (orderData) => {
    const newOrder = {
      id: `KC-${Math.floor(10000 + Math.random() * 89999)}`,
      date: 'Nov 18, 2026',
      buyerName: orderData.buyerName,
      buyerHall: orderData.buyerHall,
      meetupPoint: orderData.meetupPoint,
      paymentMethod: orderData.paymentMethod,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      commissionFee: Number((orderData.total * 0.05).toFixed(2)),
      total: orderData.total,
      status: 'Placed',
      receiptConfirmed: false,
      payoutReleased: false,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = orderData.items.find((i) => i.productId === p.id);
        return ordered ? { ...p, stock: Math.max(0, p.stock - ordered.qty) } : p;
      })
    );

    // Clear cart if checkout came from cart
    if (checkoutItems === cart) {
      setCart([]);
    }
    addNotification(`Order #${newOrder.id} placed for ${newOrder.meetupPoint}`);
    return newOrder;
  };

  const handleConfirmReceipt = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Completed', receiptConfirmed: true, payoutReleased: true } : o
      )
    );
    notify('Receipt confirmed! Seller payout released from escrow.');
    addNotification(`Escrow payout released for Order #${orderId}`);
  };

  const handleLeaveReview = (productId, rating, comment) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      productId,
      author: user ? `${user.name} (${user.hall})` : 'Verified Student',
      rating,
      comment,
      date: 'Just now',
      status: 'visible',
    };
    setReviews((prev) => [newRev, ...prev]);
    notify('Thank you! Your verified review is live.');
  };

  const handleOpenDispute = (order, reason) => {
    const seller = sellers.find((s) => s.id === order.items[0]?.sellerId);
    setDisputes((prev) => [
      {
        id: `DSP-${Math.floor(200 + Math.random() * 700)}`,
        orderId: order.id,
        reporter: `${order.buyerName} (${order.buyerHall})`,
        sellerName: seller?.name || 'Campus Seller',
        reason,
        status: 'Open',
        createdAt: 'Just now',
      },
      ...prev,
    ]);
    notify('Dispute submitted to Admin team. Escrow is paused.');
  };

  const handleSendMessage = (sellerId, text) => {
    const buyerMsg = { id: `m-${Date.now()}`, sender: 'buyer', text, time: 'Just now' };
    const sellerReply = {
      id: `m-${Date.now() + 1}`,
      sender: 'seller',
      text: 'Got it! I can meet you at the Main Library Lobby or Student Union Plaza today.',
      time: 'Just now',
    };
    setChatMessages((prev) => {
      const existing = prev[sellerId] || [];
      return { ...prev, [sellerId]: [...existing, buyerMsg, sellerReply] };
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedHall={selectedHall}
        setSelectedHall={setSelectedHall}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={products}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        notifications={notifications}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        user={user}
        role={role}
        setRole={setRole}
        onMarkNotificationsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <>
            <HeroSection
              products={products}
              onBrowse={handleBrowseCategory}
              onStartSelling={() => setActivePage('seller')}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
            <HomeSections
              products={products}
              sellers={sellers}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onBrowseCategory={handleBrowseCategory}
              onOpenAuth={() => setAuthOpen(true)}
              onNavigate={setActivePage}
            />
          </>
        )}

        {activePage === 'marketplace' && (
          <Marketplace
            products={products}
            sellers={sellers}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedHall={selectedHall}
            setSelectedHall={setSelectedHall}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activePage === 'orders' && (
          <OrdersAndTracking
            orders={orders}
            sellers={sellers}
            onConfirmReceipt={handleConfirmReceipt}
            onLeaveReview={handleLeaveReview}
            onOpenDispute={handleOpenDispute}
            onOpenChat={(seller, product) => setChatState({ isOpen: true, seller, product })}
          />
        )}

        {activePage === 'seller' && (
          <SellerDashboard
            sellers={sellers}
            products={products}
            orders={orders}
            promoCodes={promoCodes}
            onRegisterSeller={(newSel) => {
              setPendingSellers((prev) => [
                { ...newSel, id: `psel-${Date.now()}`, submittedAt: 'Just now' },
                ...prev,
              ]);
              notify('Seller application sent for Student ID verification!');
            }}
            onAddListing={(newProd) => {
              setProducts((prev) => [
                {
                  ...newProd,
                  id: `prod-${Date.now()}`,
                  rating: 5.0,
                  reviewCount: 0,
                  colors: ['#0b462d', '#f58220'],
                  colorNames: ['Classic', 'Campus Edition'],
                  featured: false,
                  status: 'approved',
                  specs: { Condition: 'New', Delivery: newProd.deliveryOption },
                },
                ...prev,
              ]);
              notify('New listing published to KampusCart!');
            }}
            onToggleFeatured={(prodId) => {
              setProducts((prev) =>
                prev.map((p) => (p.id === prodId ? { ...p, featured: !p.featured } : p))
              );
              notify('Updated featured listing status');
            }}
            onAdvanceOrderStatus={(orderId, nextStatus) => {
              setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
              );
              notify(`Order #${orderId} updated to ${nextStatus}`);
              addNotification(`Order #${orderId} is now ${nextStatus}`);
            }}
            onUpdatePayout={(sellerId, payoutMethod, payoutAccount) => {
              setSellers((prev) =>
                prev.map((s) =>
                  s.id === sellerId ? { ...s, payoutMethod, payoutAccount } : s
                )
              );
              notify('Payout settings saved');
            }}
            onCreatePromoCode={(code, discountPercent) => {
              setPromoCodes((prev) => [
                { code, discountPercent, label: `${discountPercent}% Seller Promo`, active: true },
                ...prev,
              ]);
              notify(`Promo code ${code} activated!`);
            }}
          />
        )}

        {activePage === 'admin' && (
          <AdminPanel
            sellers={sellers}
            pendingSellers={pendingSellers}
            products={products}
            orders={orders}
            disputes={disputes}
            reviews={reviews}
            partnerships={partnerships}
            onApproveSeller={(psId) => {
              const target = pendingSellers.find((p) => p.id === psId);
              if (target) {
                setSellers((prev) => [
                  ...prev,
                  {
                    ...target,
                    id: `sel-${Date.now()}`,
                    verified: true,
                    rating: 5.0,
                    totalSales: 0,
                    payoutMethod: 'Mobile Money (MTN)',
                    payoutAccount: 'Pending',
                  },
                ]);
                setPendingSellers((prev) => prev.filter((p) => p.id !== psId));
                notify(`Approved ${target.name} as Verified Student Seller!`);
              }
            }}
            onRejectSeller={(psId) => {
              setPendingSellers((prev) => prev.filter((p) => p.id !== psId));
              notify('Seller application rejected.');
            }}
            onApproveListing={(prodId) => {
              setProducts((prev) =>
                prev.map((p) => (p.id === prodId ? { ...p, status: 'approved' } : p))
              );
              notify('Listing approved!');
            }}
            onResolveDispute={(dispId) => {
              setDisputes((prev) =>
                prev.map((d) => (d.id === dispId ? { ...d, status: 'Resolved' } : d))
              );
              notify(`Dispute ${dispId} marked resolved.`);
            }}
            onToggleReviewVisibility={(revId) => {
              setReviews((prev) =>
                prev.map((r) =>
                  r.id === revId
                    ? { ...r, status: r.status === 'visible' ? 'hidden' : 'visible' }
                    : r
                )
              );
              notify('Review moderation updated.');
            }}
            onTogglePartnership={(adId) => {
              setPartnerships((prev) =>
                prev.map((a) => (a.id === adId ? { ...a, active: !a.active } : a))
              );
              notify('Brand partnership status updated.');
            }}
          />
        )}

        {activePage === 'about' && <PublicPages onNotify={notify} />}
      </main>

      <Footer onNavigate={setActivePage} onBrowseCategory={handleBrowseCategory} />

      {/* Overlays & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        seller={sellers.find((s) => s.id === selectedProduct?.sellerId)}
        reviews={reviews}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        onOpenChat={(seller, product) => {
          setSelectedProduct(null);
          setChatState({ isOpen: true, seller, product });
        }}
        onReportListing={(prod, reason) => {
          setDisputes((prev) => [
            {
              id: `RPT-${Math.floor(100 + Math.random() * 899)}`,
              orderId: 'LISTING',
              reporter: user?.name || 'Campus Student',
              sellerName: prod.title,
              reason,
              status: 'Open',
              createdAt: 'Just now',
            },
            ...prev,
          ]);
          notify('Listing reported to Admin moderation team.');
        }}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={(prodId, colorName, delta) => {
          setCart((prev) =>
            prev
              .map((i) =>
                i.productId === prodId && i.colorName === colorName
                  ? { ...i, qty: i.qty + delta }
                  : i
              )
              .filter((i) => i.qty > 0)
          );
        }}
        onRemove={(prodId, colorName) => {
          setCart((prev) =>
            prev.filter((i) => !(i.productId === prodId && i.colorName === colorName))
          );
        }}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutItems(cart);
          setCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        products={products}
        wishlistIds={wishlist}
        onClose={() => setWishlistOpen(false)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        items={checkoutItems}
        promoCodes={promoCodes}
        user={user}
        onClose={() => setCheckoutOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        onGoToOrders={() => setActivePage('orders')}
      />

      <AuthModal
        isOpen={authOpen}
        user={user}
        onClose={() => setAuthOpen(false)}
        onLogin={(u) => {
          setUser(u);
          notify(`Welcome, ${u.name}! Student ID verified.`);
        }}
        onLogout={() => {
          setUser(null);
          notify('Signed out of KampusCart.');
        }}
      />

      <ChatDrawer
        chatState={chatState}
        messages={chatMessages}
        onClose={() => setChatState({ isOpen: false, seller: null, product: null })}
        onSendMessage={handleSendMessage}
      />

      {toast && (
        <div className="toast-banner" role="status">
          <CheckCircle2 size={16} color="#4ade80" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
