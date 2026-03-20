// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 129.99,
        oldPrice: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.5,
        reviews: 128,
        badge: "Sale"
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        category: "Wearables",
        price: 299.99,
        oldPrice: 399.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.8,
        reviews: 256,
        badge: "New"
    },
    {
        id: 3,
        name: "Gaming Mouse Pro",
        category: "Gaming",
        price: 59.99,
        oldPrice: 89.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.3,
        reviews: 89,
        badge: "Sale"
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        category: "Audio",
        price: 89.99,
        oldPrice: 149.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.6,
        reviews: 167,
        badge: "Hot"
    },
    {
        id: 5,
        name: "Wireless Keyboard",
        category: "Accessories",
        price: 79.99,
        oldPrice: 119.99,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.4,
        reviews: 92
    },
    {
        id: 6,
        name: "Smartphone 13 Pro",
        category: "Phones",
        price: 999.99,
        oldPrice: 1199.99,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.9,
        reviews: 345,
        badge: "Featured"
    },
    {
        id: 7,
        name: "4K Action Camera",
        category: "Cameras",
        price: 199.99,
        oldPrice: 299.99,
        image: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.7,
        reviews: 78,
        badge: "Sale"
    },
    {
        id: 8,
        name: "Tablet Pro 12.9",
        category: "Tablets",
        price: 799.99,
        oldPrice: 999.99,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4.8,
        reviews: 156,
        badge: "New"
    }
];

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const productContainer = document.getElementById('productContainer');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    checkTheme();
    setupEventListeners();
});

// Render Products
function renderProducts() {
    if (!productContainer) return;
    
    productContainer.innerHTML = products.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="product-wishlist ${wishlist.includes(product.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})">
                    <i class="fa${wishlist.includes(product.id) ? 's' : 'r'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Generate Star Ratings
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    showToast('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showToast('Product removed from cart!');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update cart sidebar
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--gray-light);"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showToast('Added to wishlist!');
    } else {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderProducts();
}

function updateWishlistUI() {
    // Update wishlist hearts in product cards
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        const icon = btn.querySelector('i');
        
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            icon.className = 'fas fa-heart';
        } else {
            btn.classList.remove('active');
            icon.className = 'far fa-heart';
        }
    });
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Cart Sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

// Back to Top
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mobile Menu
function toggleMobileMenu() {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        navLinks.style.zIndex = '1000';
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.style.justifyContent = 'center';
        });
    } else {
        navLinks.style = '';
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toastIcon.style.color = 'var(--danger)';
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toastIcon.style.color = 'var(--success)';
        toastIcon.className = 'fas fa-check-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Newsletter Form
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showToast(`Thanks for subscribing with ${email}!`);
    e.target.reset();
});

// Contact Form
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart icon
    document.getElementById('cartIcon')?.addEventListener('click', toggleCart);
    
    // Close cart
    document.getElementById('closeCart')?.addEventListener('click', toggleCart);
    
    // Theme toggle
    themeToggle?.addEventListener('click', toggleTheme);
    
    // Back to top
    backToTop?.addEventListener('click', scrollToTop);
    
    // Mobile menu
    mobileMenu?.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
    
    // Close cart on outside click
    document.addEventListener('click', (e) => {
        if (!cartSidebar?.contains(e.target) && !e.target.closest('#cartIcon')) {
            cartSidebar?.classList.remove('open');
        }
    });
    
    // Load more products
    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
        showToast('More products coming soon!', 'info');
    });
}

// Make functions global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleWishlist = toggleWishlist;
window.toggleCart = toggleCart;