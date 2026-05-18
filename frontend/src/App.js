import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function formatPrice(value) {
  return Number(value).toFixed(2);
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);

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
      setError(err.message || 'Failed to connect to the server. Is the backend running on port 5000?');
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

      if (!response.ok) {
        throw new Error('Checkout failed. Please try again.');
      }

      setCart([]);
      setCheckoutMessage({ type: 'success', text: 'Order placed successfully!' });
    } catch (err) {
      setCheckoutMessage({
        type: 'error',
        text: err.message || 'Checkout failed. Please try again.',
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container header-inner">
          <div className="header-brand">
            <h1>🛒 TechStore</h1>
            <p>MERN Ecommerce Platform</p>
          </div>
          <div className="cart-badge" aria-label={`${cartCount} items in cart`}>
            <span className="cart-badge-icon">🛍️</span>
            <span className="cart-badge-count">{cartCount}</span>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <section className="products-section">
          <div className="section-header">
            <h2>Products</h2>
            {!loading && !error && (
              <span className="product-count">{products.length} items</span>
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
              <button type="button" className="btn-retry" onClick={fetchProducts}>
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
                  <div className="product-card-body">
                    <span className="category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                  </div>
                  <div className="product-card-footer">
                    <p className="price">${formatPrice(product.price)}</p>
                    <button
                      type="button"
                      className="btn-add-cart"
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

        <aside className="cart-section">
          <div className="section-header">
            <h2>Shopping Cart</h2>
            {cartCount > 0 && (
              <span className="product-count">{cartCount} items</span>
            )}
          </div>

          {checkoutMessage && (
            <p className={`checkout-alert checkout-alert-${checkoutMessage.type}`}>
              {checkoutMessage.text}
            </p>
          )}

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon">🛒</span>
              <p>Your cart is empty</p>
              <p className="empty-cart-hint">Add products from the list</p>
            </div>
          ) : (
            <>
              <ul className="cart-items">
                {cart.map((item) => (
                  <li key={item._id} className="cart-item">
                    <div className="cart-item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">
                        ${formatPrice(item.price)} each
                      </p>
                    </div>
                    <div className="cart-item-actions">
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
                      <p className="item-subtotal">
                        ${formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <strong>${formatPrice(getTotalPrice())}</strong>
                </div>
                <button
                  type="button"
                  className="btn-checkout"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </>
          )}
        </aside>
      </main>

      <footer className="footer">
        <p>&copy; 2024 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
