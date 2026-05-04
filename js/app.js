// ========================================================
// ARISE AURA — Premium Interactions Engine
// ========================================================

const WHATSAPP_NUM = '+917358641670';
let cart = [];

// ================= PRELOADER =================
const initPreloader = () => {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  });

  // Failsafe: remove after 3s max
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 600);
    }
  }, 3000);
};


// ================= SCROLL PROGRESS BAR =================
const initScrollProgress = () => {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
};


// ================= TOAST NOTIFICATIONS =================
const showToast = (message, icon = 'fa-check-circle') => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);

  // Trigger show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};


// ================= CART =================
const initCart = () => {
  updateCartUI();
};

const saveCart = () => {
  updateCartUI();
};

const addToCart = (product, size, qty = 1) => {
  if (!size) {
    alert('Please select a size first.');
    return;
  }

  const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === size);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += qty;
  } else {
    cart.push({ ...product, size, qty });
  }

  saveCart();

  // Bump cart badge
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.classList.remove('bump');
    void b.offsetWidth; // reflow
    b.classList.add('bump');
  });

  showToast(`${product.name} (${size}) added to cart`, 'fa-shopping-bag');
  toggleCart(true);
};

const updateQty = (index, delta) => {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
};

const removeFromCart = (index) => {
  const item = cart[index];
  cart.splice(index, 1);
  saveCart();
  showToast(`${item.name} removed from cart`, 'fa-trash');
};

window.buyNowSingle = (product, size) => {
  if (!size) {
    alert('Please select a size first.');
    return;
  }
  const base = 'https://ariseaura-simple-ecommerce.vercel.app';
  const imgPath = product.image ? (product.image.startsWith('./') ? product.image.slice(2) : product.image) : '';
  const imageUrl = imgPath ? base + '/' + imgPath : '';

  let text = '*New Order Inquiry*\n\n';
  text += 'Product: ' + product.name + '\n';
  text += 'Category: ' + product.category + '\n';
  text += 'Size: ' + size + '\n';
  text += 'Price: Rs.' + product.price.toLocaleString('en-IN') + '\n';
  if (imageUrl) text += '\nProduct Image: ' + imageUrl + '\n';
  text += '\nI would like to purchase this item immediately.';

  const url = 'https://wa.me/' + WHATSAPP_NUM.replace('+', '') + '?text=' + encodeURIComponent(text);
  window.open(url, '_blank');
};

const updateCartUI = () => {
  const badgeCounts = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  badgeCounts.forEach(b => b.textContent = totalItems);

  const cartContainer = document.getElementById('cart-items-container');
  const cartTotalDOM = document.getElementById('cart-total-amount');

  if (!cartContainer || !cartTotalDOM) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-bag" style="font-size: 2rem; color: var(--light-gray); margin-bottom: 1rem; display: block;"></i><p>Your cart is empty</p></div>`;
    cartTotalDOM.textContent = '₹0';
    return;
  }

  let total = 0;

  cartContainer.innerHTML = cart.map((item, i) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item" style="animation: fadeIn 0.3s ease ${i * 0.05}s both;">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">Size: ${item.size} · ₹${item.price.toLocaleString('en-IN')}</div>
          <div class="cart-item-actions">
            <div class="qty-selector">
              <button class="qty-btn" onclick="updateQty(${i},-1)">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty(${i},1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${i})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  cartTotalDOM.textContent = `₹${total.toLocaleString('en-IN')}`;
};


// ================= UI SETUP =================
const setupUI = () => {
  // ===== MENU =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');

  // ===== NAVBAR SCROLL + GLASSMORPHISM =====
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.onclick = () => {
      mobileMenu.classList.add('active');
      if (menuOverlay) menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  }

  const closeMenuFn = () => {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuOverlay) menuOverlay.onclick = closeMenuFn;

  const closeMenu = document.getElementById('close-menu');
  if (closeMenu) closeMenu.onclick = closeMenuFn;

  // ===== CART =====
  const cartSidebar = document.getElementById('cart-sidebar');

  window.toggleCart = (show) => {
    if (!cartSidebar) return;
    cartSidebar.classList.toggle('active', show);
    if (show) {
      // Close mobile menu if open
      closeMenuFn();
    }
  };

  document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
    btn.onclick = () => toggleCart(true);
  });

  const closeCart = document.getElementById('close-cart');
  if (closeCart) {
    closeCart.onclick = () => toggleCart(false);
  }

  // Close cart on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleCart(false);
      closeMenuFn();
    }
  });

  // ===== CHECKOUT =====
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      if (cart.length === 0) return alert('Your cart is empty');
      const base = 'https://ariseaura-simple-ecommerce.vercel.app';
      let text = '*New Order from Cart*\n\n';
      cart.forEach((item, i) => {
        const imgPath = item.image ? (item.image.startsWith('./') ? item.image.slice(2) : item.image) : '';
        const imageUrl = imgPath ? base + '/' + imgPath : '';
        text += (i + 1) + '. ' + item.name + ' (' + item.size + ') x ' + item.qty + ' = Rs.' + (item.price * item.qty).toLocaleString('en-IN') + '\n';
        if (imageUrl) text += '   Image: ' + imageUrl + '\n';
        text += '\n';
      });
      const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
      const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      text += '*TOTAL: Rs.' + totalAmount.toLocaleString('en-IN') + ' for ' + totalItems + (totalItems > 1 ? ' items' : ' item') + '*';

      const url = `https://wa.me/${WHATSAPP_NUM.replace('+', '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      cart = [];
      saveCart();
      toggleCart(false);
      showToast('Order sent to WhatsApp!', 'fa-paper-plane');
    };
  }

  // ===== INIT EFFECTS =====
  initObserver();
  observeElements();
  initParallax();
  initScrollProgress();
};


// ================= INTERSECTION OBSERVER =================
let observer;

function initObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
}

function observeElements() {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    if (!el.classList.contains('observed')) {
      observer.observe(el);
      el.classList.add('observed');
    }
  });
}

window.observeNewElements = observeElements;


// ================= HERO PARALLAX =================
const initParallax = () => {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Disable parallax on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
        if (scrollY < heroHeight) {
          heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
};


// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCart();
  setupUI();
});