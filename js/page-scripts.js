document.addEventListener('DOMContentLoaded', () => {

    // 1. FAQ Interactions
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                const answer = item.querySelector('.faq-answer');

                // Close all others
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });

                // Toggle current
                item.classList.toggle('active', !isActive);
                if (!isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            });
        });
    }

    // 2. Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const text = `*New Contact Inquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Subject:* ${subject}\n\n*Message:*\n${message}`;

            const destNum = typeof WHATSAPP_NUM !== 'undefined' ? WHATSAPP_NUM.replace('+', '') : '917358641670';
            const url = `https://wa.me/${destNum}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            contactForm.reset();

            if (typeof showToast === 'function') {
                showToast('Message sent via WhatsApp!', 'fa-paper-plane');
            }
        });
    }

    // 3. Featured Products Grid (index.html)
    const featuredGrid = document.getElementById('featured-products-grid');
    if (featuredGrid && typeof productsData !== 'undefined') {
        const featured = productsData.slice(0, 6);
        featuredGrid.innerHTML = featured.map((item, i) => `
            <div class="product-card animate-on-scroll delay-${i + 1}" onclick="window.location.href='products.html'">
                <div class="product-card-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='./assets/logo.png'">
                </div>
                <div class="product-card-body">
                    <div class="product-card-category">${item.category}</div>
                    <h3>${item.name}</h3>
                    <div class="product-card-price">₹${item.price.toLocaleString('en-IN')}</div>
                </div>
            </div>
        `).join('');
        if (window.observeNewElements) {
            window.observeNewElements();
        }
    }

    // 4. Shop Page Filters (products.html)
    const shopGrid = document.getElementById('shop-grid');
    if (shopGrid && typeof productsData !== 'undefined') {
        const sizeFilter = document.getElementById('filter-size');
        const priceFilter = document.getElementById('filter-price');
        const clearBtn = document.getElementById('clear-filters');

        function renderProducts(items) {
            if (items.length === 0) {
                shopGrid.innerHTML = '<div class="no-results"><i class="fas fa-search" style="font-size: 2.5rem; color: var(--light-gray); margin-bottom: 1rem; display: block;"></i><p>No items match your filter.</p></div>';
                return;
            }

            shopGrid.innerHTML = items.map((item, i) => {
                const sizeOptions = item.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
                return `
                <div class="product-card animate-on-scroll delay-${(i % 4) + 1}">
                    <div class="product-card-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='./assets/logo.png'">
                    </div>
                    <div class="product-card-body">
                        <div class="product-card-category">${item.category}</div>
                        <h3>${item.name}</h3>
                        <div class="product-card-price">₹${item.price.toLocaleString('en-IN')}</div>
                        
                        <div class="product-card-actions">
                            <label>Select Size <a href="size-guide.html" class="size-guide-link">Size Guide</a></label>
                            <select id="size-${item.id}">
                                <option value="" disabled selected>Choose a size</option>
                                ${sizeOptions}
                            </select>
                            <div class="product-card-btns">
                                <button onclick="window.handleAdd('${item.id}', this)" class="btn btn-gold"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                                <button onclick="window.handleBuyNow('${item.id}', this)" class="btn btn-black"><i class="fab fa-whatsapp"></i> Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join('');
        }

        function filterProducts() {
            const sVal = sizeFilter.value;
            const pVal = priceFilter.value;
            let filtered = productsData;
            if (sVal !== 'all') {
                filtered = filtered.filter(p => p.sizes.includes(sVal));
            }
            if (pVal !== 'all') {
                filtered = filtered.filter(p => {
                    if (pVal === 'under1000') return p.price < 1000;
                    if (pVal === '1000to2000') return p.price >= 1000 && p.price <= 2000;
                    if (pVal === 'over2000') return p.price > 2000;
                    return true;
                });
            }
            renderProducts(filtered);
            if (window.observeNewElements) window.observeNewElements();
        }

        sizeFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
        clearBtn.addEventListener('click', () => {
            sizeFilter.value = 'all';
            priceFilter.value = 'all';
            filterProducts();
        });

        // Initialize Products
        renderProducts(productsData);
        if (window.observeNewElements) window.observeNewElements();
    }
});

// Global handlers for product buttons
window.handleAdd = (id, btnContext) => {
    let sizeSelect = document.getElementById(`size-${id}`);
    if (btnContext) {
      sizeSelect = btnContext.closest('.product-card-actions').querySelector('select');
    }
    if (!sizeSelect || !sizeSelect.value) return alert("Please select a size");
    const size = sizeSelect.value;
    const product = typeof productsData !== 'undefined' ? productsData.find(p => p.id === id) : null;
    if (product) addToCart(product, size, 1);
};

window.handleBuyNow = (id, btnContext) => {
    let sizeSelect = document.getElementById(`size-${id}`);
    if (btnContext) {
      sizeSelect = btnContext.closest('.product-card-actions').querySelector('select');
    }
    if (!sizeSelect || !sizeSelect.value) return alert("Please select a size");
    const size = sizeSelect.value;
    const product = typeof productsData !== 'undefined' ? productsData.find(p => p.id === id) : null;
    if (product) buyNowSingle(product, size);
};
