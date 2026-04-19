// Global State
const WHATSAPP_NUM = '+917358641670';

let cart = [];

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
  toggleCart(true);
};

const updateQty = (index, delta) => {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  saveCart();
};

window.buyNowSingle = (product, size) => {
  if (!size) {
    alert('Please select a size first.');
    return;
  }
  const text = `*New Order Inquiry*\n\nProduct: ${product.name}\nCategory: ${product.category}\nSize: ${size}\nPrice: ₹${product.price.toLocaleString('en-IN')}\n\nI would like to purchase this immediately.`;
  const url = `https://wa.me/${WHATSAPP_NUM.replace('+', '')}?text=${encodeURIComponent(text)}`;
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
    cartContainer.innerHTML = `<p>Your cart is empty</p>`;
    cartTotalDOM.textContent = '₹0';
    return;
  }

  let total = 0;

  cartContainer.innerHTML = cart.map((item, i) => {
    total += item.price * item.qty;

    return `
      <div>
        ${item.name} (${item.size}) x ${item.qty}
        <button onclick="updateQty(${i},1)">+</button>
        <button onclick="updateQty(${i},-1)">-</button>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  }).join('');

  cartTotalDOM.textContent = `₹${total}`;
};

// ================= UI =================
const setupUI = () => {
  // ===== MENU =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');

  // ===== NAVBAR SCROLL =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (mobileToggle) {
    mobileToggle.onclick = () => mobileMenu.classList.add('active');
  }

  if (menuOverlay) {
    menuOverlay.onclick = () => mobileMenu.classList.remove('active');
  }

  const closeMenu = document.getElementById('close-menu');
  if (closeMenu) {
    closeMenu.onclick = () => mobileMenu.classList.remove('active');
  }

  // ===== CART =====
  const cartSidebar = document.getElementById('cart-sidebar');

  window.toggleCart = (show) => {
    if (!cartSidebar) return;
    cartSidebar.classList.toggle('active', show);
  };

  document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
    btn.onclick = () => toggleCart(true);
  });

  const closeCart = document.getElementById('close-cart');
  if (closeCart) {
    closeCart.onclick = () => toggleCart(false);
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      if (cart.length === 0) return alert('Your cart is empty');
      let text = '*New Order from Cart*\n\n';
      cart.forEach((item, i) => {
        text += `${i+1}. ${item.name} (${item.size}) x ${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}\n`;
      });
      const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
      const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      text += `\n*TOTAL:* \u20B9${totalAmount.toLocaleString('en-IN')} for ${totalItems} items.`;
      
      const url = `https://wa.me/${WHATSAPP_NUM.replace('+', '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      
      // Clear cart
      cart = [];
      saveCart();
      toggleCart(false);
    };
  }

  // ===== ANIMATION FIX =====
  initObserver();
  observeElements();
};

// ================= ANIMATION (FIXED) =================
let observer;

function initObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
}

function observeElements() {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    if (!el.classList.contains('observed')) {
      observer.observe(el);
      el.classList.add('observed');
    }
  });
}

// expose globally
window.observeNewElements = observeElements;

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  setupUI();
});