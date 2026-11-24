import React, { useState } from 'react';
import { ShieldCheck, Plus, DollarSign, Package, Users, Star, Tag, Sparkles, Store, Upload, X } from 'lucide-react';
import { CATEGORIES, HALLS, FACULTIES, DELIVERY_OPTIONS } from '../data/mockData';

export default function SellerDashboard({
  sellers,
  products,
  orders,
  promoCodes,
  onRegisterSeller,
  onAddListing,
  onToggleFeatured,
  onAdvanceOrderStatus,
  onUpdatePayout,
  onCreatePromoCode,
}) {
  const [activeSellerId, setActiveSellerId] = useState(sellers[0]?.id || 'sel-1');
  const [tab, setTab] = useState('overview');

  // New Listing Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [deliveryOption, setDeliveryOption] = useState('Campus Meet-up');
  const [shortDesc, setShortDesc] = useState('');
  const [imageData, setImageData] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 640;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImageData(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Seller Registration Form
  const [regStore, setRegStore] = useState('');
  const [regOwner, setRegOwner] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHall, setRegHall] = useState('North Hall');
  const [regFaculty, setRegFaculty] = useState('Engineering');
  const [regBio, setRegBio] = useState('');

  // Promo Code Form
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState('15');

  const activeSeller = sellers.find((s) => s.id === activeSellerId) || sellers[0];
  const sellerProducts = products.filter((p) => p.sellerId === activeSeller?.id);
  const sellerOrders = orders.filter((o) => o.items.some((i) => i.sellerId === activeSeller?.id));
  const completedRevenue = sellerOrders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total * 0.95, 0);

  const [payoutMethod, setPayoutMethod] = useState(activeSeller?.payoutMethod || 'Mobile Money (MTN)');
  const [payoutAccount, setPayoutAccount] = useState(activeSeller?.payoutAccount || '');

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return;
    onAddListing({
      title: title.trim(),
      shortDesc: shortDesc.trim() || 'Campus student-verified listing.',
      description: shortDesc.trim() || 'Listed directly from verified student storefront.',
      category,
      price: parseFloat(price),
      originalPrice: parseFloat(price) * 1.2,
      stock: parseInt(stock, 10) || 10,
      sellerId: activeSeller.id,
      hall: activeSeller.hall,
      faculty: activeSeller.faculty,
      deliveryOption,
      image: imageData.trim() || undefined,
      art:
        category === 'Food'
          ? 'food'
          : category === 'Fashion'
          ? 'sneaker'
          : category === 'Tutoring'
          ? 'tutoring'
          : category === 'Printing'
          ? 'printing'
          : category === 'Services'
          ? 'bag'
          : 'headphones',
    });
    setTitle('');
    setPrice('');
    setShortDesc('');
    setImageData('');
    setTab('listings');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    onRegisterSeller({
      name: regStore,
      owner: regOwner,
      studentId: regStudentId,
      email: regEmail,
      hall: regHall,
      faculty: regFaculty,
      bio: regBio,
    });
    setRegStore('');
    setRegOwner('');
    setRegStudentId('');
    setRegEmail('');
    setRegBio('');
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Seller Header & Storefront Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 className="section-title">Seller Hub &amp; Storefront</h1>
            {activeSeller?.verified && (
              <span className="verified-badge">
                <ShieldCheck size={12} /> Verified Student Seller
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Free storefront • 0% listing fee • 5% commission only on completed orders
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Active Store:</label>
          <select
            value={activeSellerId}
            onChange={(e) => setActiveSellerId(e.target.value)}
            className="filter-select"
          >
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.hall})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {[
          { id: 'overview', label: 'Dashboard & Orders' },
          { id: 'listings', label: `Listings (${sellerProducts.length})` },
          { id: 'promotions', label: 'Promotions & Codes' },
          { id: 'payouts', label: 'Payouts & Reports' },
          { id: 'register', label: '+ Register New Seller' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`btn-sm ${tab === t.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      {tab === 'overview' && (
        <>
          <div className="stat-grid" style={{ marginBottom: 26 }}>
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12 }}>
                <span>Net Earnings (95%)</span>
                <DollarSign size={16} color="#18181b" />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: '#18181b' }}>
                GH₵{completedRevenue.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>After 5% platform fee</div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12 }}>
                <span>Store Orders</span>
                <Package size={16} color="#f58220" />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{sellerOrders.length}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Active &amp; completed</div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12 }}>
                <span>Repeat Customers</span>
                <Users size={16} color="#2563eb" />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{activeSeller?.totalSales || 0}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{activeSeller?.hall}</div>
            </div>

            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12 }}>
                <span>Store Rating</span>
                <Star size={16} color="#16a34a" />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{activeSeller?.rating} ★</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Verified student reviews</div>
            </div>
          </div>

          {/* Storefront Bio Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1c1a18', color: '#fde047', display: 'grid', placeItems: 'center' }}>
                <Store size={22} />
              </div>
              <div>
                <strong style={{ fontSize: 16 }}>{activeSeller?.name}</strong>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {activeSeller?.owner} ({activeSeller?.studentId}) • {activeSeller?.faculty}
                </div>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{activeSeller?.bio}</div>
              </div>
            </div>
          </div>

          {/* Order Workflow Table: Accept -> Prepare -> Deliver -> Complete */}
          <h3 style={{ margin: '0 0 12px' }}>Order Workflow (Accept → Prepare → Deliver → Complete)</h3>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Buyer &amp; Meet-up</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>
                      No orders for this storefront yet.
                    </td>
                  </tr>
                ) : (
                  sellerOrders.map((order) => {
                    const nextMap = {
                      Placed: { next: 'Accepted', label: 'Accept Order' },
                      Accepted: { next: 'Preparing', label: 'Start Preparing' },
                      Preparing: { next: 'Delivering', label: 'Out for Delivery / Meet-up' },
                      Delivering: { next: 'Completed', label: 'Mark Completed' },
                    };
                    const action = nextMap[order.status];
                    return (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>
                          {order.buyerName} ({order.buyerHall})
                          <div style={{ fontSize: 11, color: '#64748b' }}>{order.meetupPoint}</div>
                        </td>
                        <td><strong>GH₵{order.total.toFixed(2)}</strong></td>
                        <td>
                          <span style={{ fontWeight: 700, color: order.status === 'Completed' ? '#16a34a' : '#d97706' }}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {action ? (
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => onAdvanceOrderStatus(order.id, action.next)}
                            >
                              {action.label}
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                              {order.payoutReleased ? 'Payout Released' : 'Awaiting Buyer Confirm'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Listings Management + Add Listing */}
      {tab === 'listings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <form
            onSubmit={handleCreateListing}
            style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, height: 'fit-content' }}
          >
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={18} color="#18181b" /> Add New Listing (Free)
            </h3>
            <input
              required
              type="text"
              placeholder="Product or Service Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                {DELIVERY_OPTIONS.filter((d) => d !== 'All Delivery').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                required
                type="number"
                step="0.01"
                min="1"
                placeholder="Price (GH₵)*"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
              <input
                required
                type="number"
                min="1"
                placeholder="Stock Qty"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Short description..."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />

            {/* Product Image Upload + URL + Live Preview */}
            <div style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#18181b',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} /> Upload Product Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                {imageData && (
                  <button
                    type="button"
                    onClick={() => setImageData('')}
                    style={{ background: 'none', border: 'none', fontSize: 11, color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                  >
                    <X size={12} /> Remove
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder="Or paste image URL (optional)"
                value={imageData.startsWith('data:') ? '' : imageData}
                onChange={(e) => setImageData(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, background: '#fff' }}
              />
              {imageData && (
                <img
                  src={imageData}
                  alt="Listing preview"
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
              )}
            </div>

            <button type="submit" className="btn-primary">
              Publish Listing
            </button>
          </form>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.title}</strong>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{p.category}</div>
                    </td>
                    <td>GH₵{p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, color: p.status === 'approved' ? '#16a34a' : '#d97706' }}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn-sm ${p.featured ? 'btn-orange' : 'btn-outline'}`}
                        onClick={() => onToggleFeatured(p.id)}
                      >
                        <Sparkles size={12} /> {p.featured ? 'Featured' : 'Promote'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promotions & Discount Codes */}
      {tab === 'promotions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCode.trim()) return;
              onCreatePromoCode(newCode.trim().toUpperCase(), parseInt(newPercent, 10) || 10);
              setNewCode('');
            }}
            style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag size={18} color="#f58220" /> Create Seller Discount Code
            </h3>
            <input
              required
              type="text"
              placeholder="Code (e.g. DORM15)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <input
              required
              type="number"
              min="5"
              max="70"
              placeholder="Discount %"
              value={newPercent}
              onChange={(e) => setNewPercent(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <button type="submit" className="btn-orange">
              Activate Discount Code
            </button>
          </form>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px' }}>Active Campus Promo Codes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {promoCodes.map((pc) => (
                <div key={pc.code} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderRadius: 10, background: '#f8fafc' }}>
                  <div>
                    <strong style={{ color: '#18181b' }}>{pc.code}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{pc.label}</div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#f58220' }}>{pc.discountPercent}% OFF</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payout Settings & Sales Reports */}
      {tab === 'payouts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0 }}>Payout Settings</h3>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            >
              <option>Mobile Money (MTN)</option>
              <option>Mobile Money (Telecel)</option>
              <option>Bank Card / Direct</option>
            </select>
            <input
              type="text"
              placeholder="Account / MoMo Number"
              value={payoutAccount}
              onChange={(e) => setPayoutAccount(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={() => onUpdatePayout(activeSeller.id, payoutMethod, payoutAccount)}
            >
              Save Payout Method
            </button>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px' }}>Sales Report Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gross Completed Sales</span>
                <strong>GH₵{(completedRevenue / 0.95).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>KampusCart Commission (5%)</span>
                <strong style={{ color: '#dc2626' }}>−GH₵{((completedRevenue / 0.95) * 0.05).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 8, fontSize: 15 }}>
                <strong>Net Payout</strong>
                <strong style={{ color: '#18181b' }}>GH₵{completedRevenue.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seller Registration with Student ID Verification */}
      {tab === 'register' && (
        <form
          onSubmit={handleRegister}
          style={{ maxWidth: 540, border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <h3 style={{ margin: 0 }}>Register a Student Storefront</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            Only verified students can sell on KampusCart. Your application goes to the Admin approval queue.
          </p>
          <input
            required
            type="text"
            placeholder="Storefront Name*"
            value={regStore}
            onChange={(e) => setRegStore(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
          <input
            required
            type="text"
            placeholder="Student Full Name*"
            value={regOwner}
            onChange={(e) => setRegOwner(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              required
              type="text"
              placeholder="Student ID (e.g. KC-2026-1234)*"
              value={regStudentId}
              onChange={(e) => setRegStudentId(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
            <input
              required
              type="email"
              placeholder=".edu Email*"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <select
              value={regHall}
              onChange={(e) => setRegHall(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            >
              {HALLS.filter((h) => h !== 'All Halls').map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <select
              value={regFaculty}
              onChange={(e) => setRegFaculty(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            >
              {FACULTIES.filter((f) => f !== 'All Faculties').map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <textarea
            rows={3}
            placeholder="Store bio — what do you sell or offer?"
            value={regBio}
            onChange={(e) => setRegBio(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
          <button type="submit" className="btn-primary">
            Submit for Student ID Verification
          </button>
        </form>
      )}
    </div>
  );
}
