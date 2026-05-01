/* ─────────────────────────────────────────────────────────────
   PRODUCT DATA
   ─────────────────────────────────────────────────────────────
   HOW TO ADD YOUR OWN IMAGES:
   1. Put your image files inside the  images/products/  folder
   2. Update the  image  field below with the filename
      e.g.  image: 'images/products/my-bread.jpg'
   3. Change name, price, category as needed
   Categories:  'bread' | 'pastry' | 'special'
───────────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "Rosemary Tomato Focaccia",
    price: 300,
    category: "bread",
    emoji: "🍞",
    image: "images/products/product1.jpeg",
    description: "Tomatoes, Rosemary rich, herb topped"
  },
  {
    id: 2,
    name: "Challah",
    price: 350,
    category: "bread ",
    emoji: "🥐",
    image: "images/products/product2.jpeg",
    description: "Soft, buttery and premium french brioche"
  },
  {
    id: 3,
    name: "Olive Focaccia",
    price: 250,
    category: "bread",
    emoji: "🥖",
    image: "images/products/product3.jpeg",
    description: "Olive oil rich, Focaccia"
  },
  {
    id: 4,
    name: "Sourdough Country Loaf",
    price: 250,
    category: "bread",
    emoji: "🍞",
    image: "images/products/product4.jpeg",
    description: "A classic loaf with a tangy flavour and chewy texture"
  },
  {
    id: 5,
    name: "Shokupan",
    price: 250,
    category: "bread",
    emoji: "🥧",
    image: "images/products/product5.jpeg",
    description: "Soft Japanese milk bread"
  },
  {
    id: 9,
    name: "Pain De Campagne",
    price: 250,
    category: "bread",
    emoji: "🥐",
    image: "images/products/product9.jpeg",
    description: "Rustic, aromatic country loaf"
  },
  {
    id: 10,
    name: "Rye Bread",
    price: 250,
    category: "special",
    emoji: "🧁",
    image: "images/products/product10.jpeg",
    description: "A dense earthy bread"
  },
  {
    id: 11,
    name: "Traditional Baguette",
    price: 250,
    category: "bread",
    emoji: "🍞",
    image: "images/products/product11.jpeg",
    description: "Crusty exterior, airy interior"
  }
];

// ── FEATURED PRODUCT (shown in the big hero-like section) ──
const FEATURED = {
  id: 99,
  name: "Rosemary Tomato Focaccia",
  price: 300,
  emoji: "🍕",
  image: "images/featured.jpeg"
};

// ─────────────────────────────────────────────────────────────
// CART STATE
// ─────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('bakery_cart') || '[]');

function saveCart() {
  localStorage.setItem('bakery_cart', JSON.stringify(cart));
}

function getCartItem(id) {
  return cart.find(i => i.id === id);
}

// Updates ONLY the action button of one card — no full re-render = no blink
function updateCardAction(id) {
  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  if (!card) return;
  const wrap = card.querySelector('.action-wrap');
  if (!wrap) return;
  const qty = (getCartItem(id) || { qty: 0 }).qty;
  wrap.innerHTML = qty > 0
    ? `<div class="counter">
         <button class="counter-btn" onclick="changeQty(${id},-1)" aria-label="Decrease">−</button>
         <span class="counter-val">${qty}</span>
         <button class="counter-btn" onclick="changeQty(${id},+1)" aria-label="Increase">+</button>
       </div>`
    : `<button class="add-btn" onclick="addToCart(${id})">Add</button>`;
}

function addToCart(id) {
  const product = id === 99 ? FEATURED : PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = getCartItem(id);
  if (existing) { existing.qty++; }
  else { cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, emoji: product.emoji, qty: 1 }); }
  saveCart();
  updateCartUI();
  updateCardAction(id);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  updateCardAction(id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart();
  updateCartUI();
  updateCardAction(id);
}

// ─────────────────────────────────────────────────────────────
// RENDER PRODUCTS
// ─────────────────────────────────────────────────────────────
let activeFilter = 'all';

function renderProductCards() {
  const grid = document.getElementById('productsGrid');
  const filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category.trim() === activeFilter);

  // Show "Coming Soon" card if no products in this category
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="coming-soon-card" style="grid-column:1/-1">
        <div class="cs-inner">
          <div class="cs-icon">✦</div>
          <h3>Coming Soon</h3>
          <p>We're perfecting something special for this collection.<br/>Check back soon — good things take time.</p>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const qty = (getCartItem(p.id) || { qty: 0 }).qty;
    const actionHTML = qty > 0
      ? `<div class="counter">
           <button class="counter-btn" onclick="changeQty(${p.id},-1)" aria-label="Decrease">−</button>
           <span class="counter-val">${qty}</span>
           <button class="counter-btn" onclick="changeQty(${p.id},+1)" aria-label="Increase">+</button>
         </div>`
      : `<button class="add-btn" onclick="addToCart(${p.id})">Add</button>`;

    return `
      <div class="product-card reveal" data-id="${p.id}" data-category="${p.category.trim()}">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
          <div class="product-img-placeholder" style="display:none">${p.emoji}</div>
        </div>
        <div class="product-info">
          <div class="product-price-row">
            <span class="product-price">Rs. ${p.price}</span>
            <button class="product-info-btn" title="${p.description}" aria-label="Info">ⓘ</button>
          </div>
          <div class="product-name-row">
            <span class="product-name">${p.name}</span>
            <div class="action-wrap">${actionHTML}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ─────────────────────────────────────────────────────────────
// CART UI
// ─────────────────────────────────────────────────────────────
function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  document.getElementById('cartCount').textContent = totalItems;
  document.getElementById('cartTotal').textContent = `Rs. ${totalPrice.toFixed(0)}`;

  const itemsEl = document.getElementById('cartItems');
  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Your cart is empty.<br/>Add some delicious items!</p>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}"
           onerror="this.style.fontSize='2rem';this.style.background='#222';this.textContent='${item.emoji}';this.style.display='flex';this.style.alignItems='center';this.style.justifyContent='center'"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <p class="ci-price">Rs. ${(item.price * item.qty).toFixed(0)}</p>
        <div class="cart-item-controls">
          <button class="cart-item-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-item-btn" onclick="changeQty(${item.id},+1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑</button>
        </div>
      </div>
    </div>`).join('');
}

// ─────────────────────────────────────────────────────────────
// QUICK ADD (for featured section)
// ─────────────────────────────────────────────────────────────
function quickAdd(id) {
  addToCart(id);
}

// ─────────────────────────────────────────────────────────────
// CART SIDEBAR TOGGLE
// ─────────────────────────────────────────────────────────────
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// ─────────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });

// ─────────────────────────────────────────────────────────────
// NAVBAR SCROLL
// ─────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ─────────────────────────────────────────────────────────────
// FILTER
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProductCards();
  });
});

// ─────────────────────────────────────────────────────────────
// HAMBURGER
// ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); });
});

// ─────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) { showToast('⚠️ Your cart is empty!'); return; }
  showToast('🎉 Order placed! Thank you for shopping with us.');
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
});

// ─────────────────────────────────────────────────────────────
// STATIC REVEALS (non-product elements)
// ─────────────────────────────────────────────────────────────
function initReveal() {
  document.querySelectorAll('.contact-card, .stat, .about-text, .promo-content').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
renderProductCards();
updateCartUI();
initReveal();
