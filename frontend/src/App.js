import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CATEGORY_ICONS = {
  Electronics: '⚡',
  Accessories: '🎧',
  Storage: '💾',
  default: '📦',
};

function formatPrice(value) {
  return Number(value).toFixed(2);
}

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const cartRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`Could not load products (${response.status})`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(
        err.message ||
          'Cannot reach the server. Start the backend: cd backend && npm start'
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product) => {
    setCheckoutMessage(null);
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCheckoutMessage(null);
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCheckoutMessage(null);
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCart = () => {
    cartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutMessage(null);

    try {
      const order = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalPrice(),
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || `Checkout failed (${response.status})`);
      }

      setCart([]);
      setShowCheckoutModal(false);
      setLastOrderId(data.orderId || data.order?._id);
      setCheckoutMessage({
        type: 'success',
        text: data.message || 'Order placed successfully!',
      });
    } catch (err) {
      setCheckoutMessage({
        type: 'error',
        text: err.message || 'Checkout failed. Please try again.',
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckoutModal(true);
    setCheckoutMessage(null);
  };

  return (
    <div className="App">
      <div className="bg-gradient" aria-hidden="true" />

      <header className="header">
        <div className="container header-inner">
          <div className="header-brand">
            <span className="logo-mark">TS</span>
            <div>
              <h1>TechStore</h1>
              <p>Premium tech, delivered fast</p>
            </div>
          </div>
          <button
            type="button"
            className="cart-badge"
            onClick={scrollToCart}
            aria-label={`${cartCount} items in cart`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className="container main-content">
        <section className="products-section">
          <div className="section-header">
            <div>
              <h2>Shop</h2>
              <p className="section-subtitle">Curated gadgets & accessories</p>
            </div>
            {!loading && !error && (
              <span className="product-count">{products.length} products</span>
            )}
          </div>

          {loading && (
            <div className="state-message">
              <div className="spinner" />
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="state-message state-error">
              <p>{error}</p>
              <button type="button" className="btn-secondary" onClick={fetchProducts}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="state-message">
              <p>No products available</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <article key={product._id} className="product-card">
                  <div className="product-visual">
                    <span className="product-emoji">{getCategoryIcon(product.category)}</span>
                  </div>
                  <div className="product-card-body">
                    <span className="category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                  </div>
                  <div className="product-card-footer">
                    <p className="price">
                      <span className="price-currency">$</span>
                      {formatPrice(product.price)}
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="cart-section" ref={cartRef}>
          <div className="section-header cart-header">
            <div>
              <h2>Your Cart</h2>
              <p className="section-subtitle">
                {cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''}` : 'Nothing here yet'}
              </p>
            </div>
          </div>

          {checkoutMessage && (
            <div className={`toast toast-${checkoutMessage.type}`} role="alert">
              <span className="toast-icon">
                {checkoutMessage.type === 'success' ? '✓' : '!'}
              </span>
              <div>
                <p>{checkoutMessage.text}</p>
                {lastOrderId && checkoutMessage.type === 'success' && (
                  <p className="order-id">Order #{String(lastOrderId).slice(-8).toUpperCase()}</p>
                )}
              </div>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-visual">🛒</div>
              <p>Your cart is empty</p>
              <p className="empty-cart-hint">Browse the shop and add your favorites</p>
            </div>
          ) : (
            <>
              <ul className="cart-items">
                {cart.map((item) => (
                  <li key={item._id} className="cart-item">
                    <span className="cart-item-icon">{getCategoryIcon(item.category)}</span>
                    <div className="cart-item-main">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">${formatPrice(item.price)} each</p>
                      <div className="cart-item-row">
                        <div className="quantity-controls">
                          <button
                            type="button"
                            className="btn-qty"
                            onClick={() => updateQuantity(item._id, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            type="button"
                            className="btn-qty"
                            onClick={() => updateQuantity(item._id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="item-subtotal">
                          ${formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-icon-remove"
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-summary">
                <div className="cart-total-row">
                  <span>Total</span>
                  <strong>${formatPrice(getTotalPrice())}</strong>
                </div>
                <button
                  type="button"
                  className="btn-checkout"
                  onClick={openCheckout}
                  disabled={checkoutLoading}
                >
                  Orders Checkout
                </button>
              </div>
            </>
          )}
        </aside>
      </main>

      <footer className="footer">
        <p>&copy; 2024 TechStore · MERN Ecommerce Platform</p>
      </footer>

      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => !checkoutLoading && setShowCheckoutModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="checkout-title">
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowCheckoutModal(false)}
              disabled={checkoutLoading}
              aria-label="Close"
            >
              ×
            </button>
            <h2 id="checkout-title">Confirm Order</h2>
            <p className="modal-subtitle">Review your items before placing the order</p>

            <ul className="modal-items">
              {cart.map((item) => (
                <li key={item._id}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>${formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="modal-total">
              <span>Total due</span>
              <strong>${formatPrice(getTotalPrice())}</strong>
            </div>

            {checkoutMessage?.type === 'error' && (
              <p className="modal-error">{checkoutMessage.text}</p>
            )}

            <button
              type="button"
              className="btn-checkout btn-checkout-confirm"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <span className="spinner spinner-sm" />
                  Placing order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      )}

      {checkoutMessage?.type === 'success' && !showCheckoutModal && (
        <div className="success-overlay" onClick={() => setCheckoutMessage(null)}>
          <div className="success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-check">✓</div>
            <h3>Thank you!</h3>
            <p>Your order has been placed.</p>
            {lastOrderId && (
              <p className="order-id">Order #{String(lastOrderId).slice(-8).toUpperCase()}</p>
            )}
            <button type="button" className="btn-primary" onClick={() => setCheckoutMessage(null)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
