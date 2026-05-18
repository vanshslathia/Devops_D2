// API Configuration
// In Docker: use backend service name, locally use localhost
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:3000/api" 
  : "http://backend:3000/api";

let allProducts = [];
let cart = {};
let wishlist = [];
let orderHistory = [];
let filteredProducts = [];
let currentProduct = null;
let appliedDiscount = 0;

// Coupon codes
const coupons = {
    "SAVE10": 0.10,
    "SAVE20": 0.20,
    "TECH50": 0.50
};

// ==================== DOM Elements ====================
const cartBtn = document.getElementById("cartBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const orderHistoryBtn = document.getElementById("orderHistoryBtn");
const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");
const confirmationModal = document.getElementById("confirmationModal");
const productDetailModal = document.getElementById("productDetailModal");
const wishlistModal = document.getElementById("wishlistModal");
const orderHistoryModal = document.getElementById("orderHistoryModal");

const closeCart = document.getElementById("closeCart");
const closeCheckout = document.getElementById("closeCheckout");
const closeConfirmation = document.getElementById("closeConfirmation");
const closeProductDetail = document.getElementById("closeProductDetail");
const closeWishlist = document.getElementById("closeWishlist");
const closeOrderHistory = document.getElementById("closeOrderHistory");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const continueBtn = document.getElementById("continueBtn");
const productsGrid = document.getElementById("productsGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const priceRange = document.getElementById("priceRange");
const sortBy = document.getElementById("sortBy");
const noProducts = document.getElementById("noProducts");
const addDetailToCart = document.getElementById("addDetailToCart");
const addDetailToWishlist = document.getElementById("addDetailToWishlist");
const newsletterForm = document.getElementById("newsletterForm");

// ==================== Event Listeners ====================
cartBtn.addEventListener("click", openCart);
wishlistBtn.addEventListener("click", openWishlist);
orderHistoryBtn.addEventListener("click", openOrderHistory);

closeCart.addEventListener("click", closeCartModal);
closeCheckout.addEventListener("click", closeCheckoutModal);
closeConfirmation.addEventListener("click", closeConfirmationModal);
closeProductDetail.addEventListener("click", closeProductDetailModal);
closeWishlist.addEventListener("click", closeWishlistModal);
closeOrderHistory.addEventListener("click", closeOrderHistoryModal);

checkoutBtn.addEventListener("click", openCheckout);
checkoutForm.addEventListener("submit", placeOrder);
continueBtn.addEventListener("click", continueShopping);

addDetailToCart.addEventListener("click", addProductDetailToCart);
addDetailToWishlist.addEventListener("click", toggleWishlistDetail);

priceRange.addEventListener("change", filterByPrice);
sortBy.addEventListener("change", sortProducts);

filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.target.closest(".filter-btn").classList.add("active");
        const category = e.target.closest(".filter-btn").dataset.category;
        if (category === "all") {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(p => p.category === category);
        }
        displayProducts(filteredProducts);
    });
});

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
    updateNoProducts();
});

newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("✓ Thanks for subscribing!", "success");
    newsletterForm.reset();
});

window.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCartModal();
    if (e.target === checkoutModal) closeCheckoutModal();
    if (e.target === confirmationModal) closeConfirmationModal();
    if (e.target === productDetailModal) closeProductDetailModal();
    if (e.target === wishlistModal) closeWishlistModal();
    if (e.target === orderHistoryModal) closeOrderHistoryModal();
});

// ==================== Initialize ====================
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadWishlist();
    loadOrderHistory();
});

// ==================== Products ====================
function loadProducts() {
    fetch(`${API_BASE_URL}/products`)
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            allProducts = data;
            filteredProducts = [...data];
            displayProducts(data);
        })
        .catch(err => {
            console.error("Error loading products:", err);
            productsGrid.innerHTML = '<div style="padding: 2rem; text-align: center; color: #e74c3c;">Error loading products. Please try again later.</div>';
        });
}

function displayProducts(products) {
    productsGrid.innerHTML = "";
    
    if (products.length === 0) {
        noProducts.style.display = "block";
        return;
    }
    
    noProducts.style.display = "none";
    
    products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        const emoji = getProductEmoji(product.category);
        const inWishlist = wishlist.some(p => p.id === product.id);
        
        productCard.innerHTML = `
            <div class="product-image">
                <span>${emoji}</span>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <input type="number" class="quantity-input" value="1" min="1" max="100" id="qty-${product.id}">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                    <button class="btn-wishlist ${inWishlist ? 'in-wishlist' : ''}" onclick="toggleWishlist(${product.id})" title="Add to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <button style="width: 100%; margin-top: 0.75rem; padding: 0.6rem; background: rgba(102, 126, 234, 0.1); color: #667eea; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="viewProductDetail(${product.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function getProductEmoji(category) {
    const emojiMap = {
        "Electronics": "💻",
        "Accessories": "⌨️"
    };
    return emojiMap[category] || "📦";
}

function updateNoProducts() {
    if (filteredProducts.length === 0) {
        noProducts.style.display = "block";
    } else {
        noProducts.style.display = "none";
    }
}

// ==================== Product Details ====================
function viewProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    const inWishlist = wishlist.some(p => p.id === productId);

    document.getElementById("detailName").textContent = product.name;
    document.getElementById("detailCategory").textContent = product.category;
    document.getElementById("detailDescription").textContent = product.description;
    document.getElementById("detailPrice").textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById("detailImageEmoji").textContent = getProductEmoji(product.category);
    document.getElementById("detailQty").value = 1;
    document.getElementById("detailStock").textContent = `${15 + productId} in stock`;
    
    addDetailToWishlist.classList.toggle("in-wishlist", inWishlist);
    
    productDetailModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeProductDetailModal() {
    productDetailModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function incrementQty() {
    const input = document.getElementById("detailQty");
    input.value = parseInt(input.value) + 1;
}

function decrementQty() {
    const input = document.getElementById("detailQty");
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addProductDetailToCart() {
    const quantity = parseInt(document.getElementById("detailQty").value);
    addToCart(currentProduct.id, quantity);
    closeProductDetailModal();
}

// ==================== Wishlist ====================
function toggleWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    const index = wishlist.findIndex(p => p.id === productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification("❌ Removed from wishlist", "info");
    } else {
        wishlist.push(product);
        showNotification("❤️ Added to wishlist!", "success");
    }
    
    updateWishlistCount();
    saveWishlist();
    displayProducts(filteredProducts);
}

function toggleWishlistDetail() {
    if (currentProduct) {
        toggleWishlist(currentProduct.id);
        const inWishlist = wishlist.some(p => p.id === currentProduct.id);
        addDetailToWishlist.classList.toggle("in-wishlist", inWishlist);
    }
}

function updateWishlistCount() {
    document.getElementById("wishlistCount").textContent = wishlist.length;
}

function openWishlist() {
    const wishlistItems = document.getElementById("wishlistItems");
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `<div class="empty-list-message"><i class="fas fa-heart"></i><p>Your wishlist is empty</p></div>`;
    } else {
        wishlistItems.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category}</p>
                </div>
                <div class="wishlist-item-price">₹${item.price.toFixed(2)}</div>
                <button class="btn-remove-wishlist" onclick="toggleWishlist(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `).join("");
    }
    
    wishlistModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeWishlistModal() {
    wishlistModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function saveWishlist() {
    localStorage.setItem("techstore_wishlist", JSON.stringify(wishlist));
}

function loadWishlist() {
    const saved = localStorage.getItem("techstore_wishlist");
    if (saved) {
        wishlist = JSON.parse(saved);
        updateWishlistCount();
    }
}

// ==================== Order History ====================
function openOrderHistory() {
    const orderHistoryItems = document.getElementById("orderHistoryItems");
    
    if (orderHistory.length === 0) {
        orderHistoryItems.innerHTML = `<div class="empty-list-message"><i class="fas fa-inbox"></i><p>No orders yet</p></div>`;
    } else {
        orderHistoryItems.innerHTML = orderHistory.map(order => `
            <div class="order-history-item">
                <div class="order-history-info">
                    <h4>Order #${order.id}</h4>
                    <div class="order-history-details">
                        <p><strong>Email:</strong> ${order.customer.email}</p>
                        <p><strong>Items:</strong> ${order.items.length}</p>
                        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                    </div>
                </div>
                <button class="btn-reorder" onclick="reorderItems(${order.id})">
                    <i class="fas fa-redo"></i> Reorder
                </button>
            </div>
        `).join("");
    }
    
    orderHistoryModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeOrderHistoryModal() {
    orderHistoryModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function reorderItems(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (order) {
        order.items.forEach(item => {
            addToCart(item.id, item.quantity);
        });
        showNotification("✓ Items added to cart!", "success");
        closeOrderHistoryModal();
        openCart();
    }
}

// ==================== Filters ====================
function filterByPrice() {
    const maxPrice = parseInt(priceRange.value);
    document.getElementById("priceValue").textContent = `₹0 - ₹${maxPrice}`;
    
    filteredProducts = allProducts.filter(p => p.price <= maxPrice);
    displayProducts(filteredProducts);
    updateNoProducts();
}

function sortProducts() {
    const sortOption = sortBy.value;
    let sorted = [...filteredProducts];

    switch(sortOption) {
        case "price-low":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "name-asc":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "name-desc":
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    displayProducts(sorted);
}

// ==================== Cart Management ====================
function addToCart(productId, quantity = null) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    if (!quantity && quantityInput) {
        quantity = parseInt(quantityInput.value);
    }
    if (!quantity) quantity = 1;
    
    fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
    })
    .then(res => res.json())
    .then(data => {
        cart = data.cart;
        updateCartCount();
        showNotification(`✓ ${quantity} item(s) added to cart!`, "success");
        if (quantityInput) quantityInput.value = 1;
    })
    .catch(err => {
        console.error("Error adding to cart:", err);
        showNotification("Error adding to cart", "error");
    });
}

function removeFromCart(productId) {
    fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        cart = data.cart;
        displayCartItems();
        updateCartCount();
        showNotification("Product removed from cart", "success");
    })
    .catch(err => {
        console.error("Error removing from cart:", err);
        showNotification("Error removing from cart", "error");
    });
}

function updateCartCount() {
    const count = Object.keys(cart).length;
    document.getElementById("cartCount").textContent = count;
}

function displayCartItems() {
    const cartItemsDiv = document.getElementById("cartItems");
    const items = Object.values(cart);

    if (items.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        document.getElementById("subtotal").textContent = "0.00";
        document.getElementById("tax").textContent = "0.00";
        document.getElementById("total").textContent = "0.00";
        return;
    }

    cartItemsDiv.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `).join("");

    updateCartSummary(items);
}

function updateCartSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * appliedDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.1;
    const total = discountedSubtotal + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);

    if (appliedDiscount > 0) {
        document.getElementById("discountRow").style.display = "flex";
        document.getElementById("discountAmount").textContent = discountAmount.toFixed(2);
    } else {
        document.getElementById("discountRow").style.display = "none";
    }
}

function applyCoupon() {
    const couponCode = document.getElementById("couponCode").value.toUpperCase();
    
    if (coupons[couponCode]) {
        appliedDiscount = coupons[couponCode];
        showNotification(`✓ Coupon applied! ${(appliedDiscount * 100)}% discount`, "success");
        const items = Object.values(cart);
        updateCartSummary(items);
        document.getElementById("couponCode").value = "";
    } else if (couponCode) {
        showNotification("Invalid coupon code", "error");
    }
}

// ==================== Modal Operations ====================
function openCart() {
    fetch(`${API_BASE_URL}/cart`)
        .then(res => res.json())
        .then(data => {
            cart = data;
            displayCartItems();
            cartModal.classList.add("show");
            document.body.style.overflow = "hidden";
        })
        .catch(err => {
            console.error("Error loading cart:", err);
            showNotification("Error loading cart", "error");
        });
}

function closeCartModal() {
    cartModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function openCheckout() {
    if (Object.keys(cart).length === 0) {
        showNotification("Your cart is empty!", "warning");
        return;
    }

    const items = Object.values(cart);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * appliedDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.1;
    const total = discountedSubtotal + tax;

    const orderSummary = items.map(item => `
        <div class="review-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join("");

    document.getElementById("orderSummary").innerHTML = orderSummary;
    document.getElementById("checkoutTotal").textContent = total.toFixed(2);

    cartModal.classList.remove("show");
    checkoutModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
    checkoutModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function closeConfirmationModal() {
    confirmationModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function continueShopping() {
    confirmationModal.classList.remove("show");
    cart = {};
    appliedDiscount = 0;
    updateCartCount();
    searchInput.value = "";
    sortBy.value = "";
    priceRange.value = 1500;
    document.getElementById("priceValue").textContent = "₹0 - ₹1500";
    filterBtns.forEach(btn => btn.classList.remove("active"));
    filterBtns[0].classList.add("active");
    displayProducts(allProducts);
    document.body.style.overflow = "auto";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==================== Order Placement ====================
function placeOrder(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!email || !address) {
        showNotification("Please fill in all required fields", "warning");
        return;
    }

    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, address })
    })
    .then(res => res.json())
    .then(data => {
        if (data.order) {
            orderHistory.unshift(data.order);
            localStorage.setItem("techstore_orders", JSON.stringify(orderHistory));
            showOrderConfirmation(data.order);
            closeCheckoutModal();
            checkoutForm.reset();
        } else {
            showNotification(data.message || "Error placing order", "error");
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    })
    .catch(err => {
        console.error("Error placing order:", err);
        showNotification("Error placing order. Please try again.", "error");
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    });
}

function showOrderConfirmation(order) {
    const confirmationDetails = document.getElementById("confirmationDetails");
    const itemsList = order.items.map(item => 
        `<p>• <strong>${item.name}</strong> × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>`
    ).join("");

    confirmationDetails.innerHTML = `
        <div class="confirmation-details">
            <h4><i class="fas fa-hashtag"></i> Order ID: #${order.id}</h4>
            <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${order.customer.email}</p>
            <p><strong><i class="fas fa-map-marker-alt"></i> Shipping Address:</strong></p>
            <p style="margin-left: 1.5rem;">${order.customer.address}</p>
            
            <h4 style="margin-top: 1rem;"><i class="fas fa-box"></i> Items Ordered:</h4>
            <div style="margin-left: 1rem;">
                ${itemsList}
            </div>
            
            <h4 style="margin-top: 1rem;"><i class="fas fa-dollar-sign"></i> Order Total:</h4>
            <p style="font-size: 1.3rem; color: #4caf50; font-weight: bold;">₹${order.total.toFixed(2)}</p>
            
            <p style="margin-top: 1rem; color: #666;"><strong>Status:</strong> <span style="color: #4caf50;">✓ ${order.status}</span></p>
            <p style="color: #666; font-style: italic;">Thank you for your order! Your items will be shipped soon.</p>
        </div>
    `;

    confirmationModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

// ==================== Utilities ====================
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        max-width: 350px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease forwards";
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationColor(type) {
    const colors = {
        success: "#4caf50",
        error: "#ff6b6b",
        warning: "#ffd93d",
        info: "#667eea"
    };
    return colors[type] || colors.info;
}

// Save order history to local storage
function saveOrderHistory() {
    localStorage.setItem("techstore_orders", JSON.stringify(orderHistory));
}

function loadOrderHistory() {
    const saved = localStorage.getItem("techstore_orders");
    if (saved) {
        orderHistory = JSON.parse(saved);
    }
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
