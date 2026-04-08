/* =====================================================
   FreshMart — script.js
   Handles: Products, Cart, Filters, Nav, Toast, Form
   ===================================================== */

/* =====================================================
   PRODUCT DATA
   ===================================================== */
const products = [
  {
    id: 1,
    name: "Alphonso Mangoes",
    category: "fruits",
    emoji: "🥭",
    price: 199,
    originalPrice: 249,
    unit: "per kg",
    badge: "Seasonal",
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    category: "fruits",
    emoji: "🍓",
    price: 149,
    originalPrice: 199,
    unit: "250g pack",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Red Grapes",
    category: "fruits",
    emoji: "🍇",
    price: 89,
    originalPrice: null,
    unit: "500g pack",
    badge: null,
  },
  {
    id: 4,
    name: "Navel Oranges",
    category: "fruits",
    emoji: "🍊",
    price: 65,
    originalPrice: 80,
    unit: "per kg",
    badge: "10% Off",
  },
  {
    id: 5,
    name: "Broccoli Crown",
    category: "vegetables",
    emoji: "🥦",
    price: 55,
    originalPrice: null,
    unit: "per piece",
    badge: "Organic",
  },
  {
    id: 6,
    name: "Cherry Tomatoes",
    category: "vegetables",
    emoji: "🍅",
    price: 79,
    originalPrice: 95,
    unit: "250g punnet",
    badge: null,
  },
  {
    id: 7,
    name: "Baby Carrots",
    category: "vegetables",
    emoji: "🥕",
    price: 45,
    originalPrice: null,
    unit: "500g bag",
    badge: "Fresh",
  },
  {
    id: 8,
    name: "Spinach Bunch",
    category: "vegetables",
    emoji: "🥬",
    price: 35,
    originalPrice: null,
    unit: "per bunch",
    badge: null,
  },
  {
    id: 9,
    name: "Full-Cream Milk",
    category: "dairy",
    emoji: "🥛",
    price: 62,
    originalPrice: null,
    unit: "1 litre",
    badge: "Farm Fresh",
  },
  {
    id: 10,
    name: "Greek Yoghurt",
    category: "dairy",
    emoji: "🫙",
    price: 115,
    originalPrice: 135,
    unit: "400g tub",
    badge: "15% Off",
  },
  {
    id: 11,
    name: "Cheddar Cheese",
    category: "dairy",
    emoji: "🧀",
    price: 189,
    originalPrice: 220,
    unit: "200g block",
    badge: null,
  },
  {
    id: 12,
    name: "Free-Range Eggs",
    category: "dairy",
    emoji: "🥚",
    price: 95,
    originalPrice: null,
    unit: "12 pack",
    badge: "Organic",
  },
];

/* =====================================================
   CART STATE
   ===================================================== */
let cart = []; // Array of { product, qty }

/* =====================================================
   DOM REFERENCES
   ===================================================== */
const productGrid   = document.getElementById("productGrid");
const filterBtns    = document.querySelectorAll(".filter-btn");
const cartBtn       = document.getElementById("cartBtn");
const cartBadge     = document.getElementById("cartBadge");
const cartDrawer    = document.getElementById("cartDrawer");
const cartOverlay   = document.getElementById("cartOverlay");
const cartClose     = document.getElementById("cartClose");
const cartItemsEl   = document.getElementById("cartItems");
const cartEmpty     = document.getElementById("cartEmpty");
const cartTotal     = document.getElementById("cartTotal");
const cartFooter    = document.getElementById("cartFooter");
const toast         = document.getElementById("toast");
const navbar        = document.getElementById("navbar");
const menuToggle    = document.getElementById("menuToggle");
const navLinks      = document.getElementById("navLinks");
const contactForm   = document.getElementById("contactForm");
const formSuccess   = document.getElementById("formSuccess");

/* =====================================================
   RENDER PRODUCTS
   ===================================================== */
function renderProducts(filter = "all") {
  const filtered = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  productGrid.innerHTML = "";

  filtered.forEach((product, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 0.07}s`;

    const inCart = cart.find(c => c.product.id === product.id);

    card.innerHTML = `
      ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
      <div class="product-image-wrap">${product.emoji}</div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-unit">${product.unit}</div>
        <div class="product-footer">
          <div class="product-price">
            ${product.originalPrice ? `<span>₹${product.originalPrice}</span>` : ""}
            ₹${product.price}
          </div>
          <button
            class="add-to-cart-btn ${inCart ? "added" : ""}"
            data-id="${product.id}"
            aria-label="Add ${product.name} to cart"
          >
            <i class="ph ph-${inCart ? "check" : "plus"}"></i>
            ${inCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  // Attach click events to add-to-cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

/* =====================================================
   CART FUNCTIONS
   ===================================================== */

/** Add or increment a product in the cart */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.product.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }

  updateCartUI();
  renderProducts(getCurrentFilter());
  showToast(`${product.emoji} ${product.name} added to basket!`);
}

/** Decrement or remove a product from the cart */
function decrementFromCart(productId) {
  const index = cart.findIndex(c => c.product.id === productId);
  if (index === -1) return;

  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  updateCartUI();
  renderProducts(getCurrentFilter());
}

/** Remove a product entirely */
function removeFromCart(productId) {
  cart = cart.filter(c => c.product.id !== productId);
  updateCartUI();
  renderProducts(getCurrentFilter());
}

/** Rerender cart drawer contents + badge + total */
function updateCartUI() {
  // Badge count
  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
  cartBadge.textContent = totalQty;
  cartBadge.style.transform = "scale(1.4)";
  setTimeout(() => (cartBadge.style.transform = "scale(1)"), 200);

  // Total price
  const totalPrice = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;

  // Empty state
  if (cart.length === 0) {
    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";
  } else {
    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";
  }

  // Render items
  const existingItems = cartItemsEl.querySelectorAll(".cart-item");
  existingItems.forEach(el => el.remove());

  cart.forEach(({ product, qty }) => {
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <div class="cart-item-emoji">${product.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">₹${(product.price * qty).toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn decrement" data-id="${product.id}" aria-label="Decrease quantity">−</button>
        <span class="qty-display">${qty}</span>
        <button class="qty-btn increment" data-id="${product.id}" aria-label="Increase quantity">+</button>
      </div>
    `;
    cartItemsEl.appendChild(item);
  });

  // Qty button listeners
  cartItemsEl.querySelectorAll(".increment").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
  });
  cartItemsEl.querySelectorAll(".decrement").forEach(btn => {
    btn.addEventListener("click", () => decrementFromCart(parseInt(btn.dataset.id)));
  });
}

/* =====================================================
   CART DRAWER TOGGLE
   ===================================================== */
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* =====================================================
   FILTER BUTTONS
   ===================================================== */
function getCurrentFilter() {
  const active = document.querySelector(".filter-btn.active");
  return active ? active.dataset.filter : "all";
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

/* =====================================================
   NAVBAR SCROLL EFFECT
   ===================================================== */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);

  // Highlight active nav link based on scroll position
  const sections = ["home", "products", "about", "contact"];
  let current = "home";
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) {
      current = id;
    }
  });
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

/* =====================================================
   MOBILE MENU TOGGLE
   ===================================================== */
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  // Animate hamburger → X
  const spans = menuToggle.querySelectorAll("span");
  const isOpen = navLinks.classList.contains("open");
  spans[0].style.transform = isOpen ? "rotate(45deg) translate(5px, 5px)" : "";
  spans[1].style.opacity   = isOpen ? "0" : "1";
  spans[2].style.transform = isOpen ? "rotate(-45deg) translate(5px, -5px)" : "";
});

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    const spans = menuToggle.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity   = "1";
    spans[2].style.transform = "";
  });
});

/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* =====================================================
   CONTACT FORM
   ===================================================== */
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Basic validation
  if (!name || !email || !message) {
    showToast("⚠️ Please fill in all fields.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("⚠️ Please enter a valid email.");
    return;
  }

  // Simulate form submission
  const submitBtn = contactForm.querySelector(".btn-primary");
  submitBtn.textContent = "Sending…";
  submitBtn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    formSuccess.classList.add("show");
    submitBtn.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
    submitBtn.disabled = false;
    setTimeout(() => formSuccess.classList.remove("show"), 4000);
  }, 1200);
});

/* =====================================================
   SMOOTH SCROLL for anchor links
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height offset
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* =====================================================
   INTERSECTION OBSERVER — Fade-in on scroll
   ===================================================== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Observe section blocks
document.querySelectorAll(".feature-item, .about-container, .contact-wrapper").forEach(el => {
  el.style.opacity    = "0";
  el.style.transform  = "translateY(30px)";
  el.style.transition = "opacity .6s ease, transform .6s ease";
  observer.observe(el);
});

/* =====================================================
   INIT
   ===================================================== */
renderProducts("all");
updateCartUI();
