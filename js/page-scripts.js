document.addEventListener('DOMContentLoaded', () => {

    // 1. FAQ Interactions
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(faq => faq.classList.remove('active'));
                if (!isActive) item.classList.add('active');
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
            
            // Ensure WHATSAPP_NUM is globally available via app.js
            const destNum = typeof WHATSAPP_NUM !== 'undefined' ? WHATSAPP_NUM.replace('+', '') : '917358641670';
            const url = `https://wa.me/${destNum}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            contactForm.reset();
        });
    }

    // 3. Featured Products Grid (index.html)
    const featuredGrid = document.getElementById('featured-products-grid');
    if (featuredGrid && typeof productsData !== 'undefined') {
        const featured = productsData.slice(0, 3);
        featuredGrid.innerHTML = featured.map(item => `
            <div class="product-card animate-on-scroll" style="background: var(--white); border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; cursor: pointer;" onclick="window.location.href='products.html'">
                <div style="position: relative; padding-top: 100%; background: #eae8e1;">
                    <img src="${item.image}" alt="${item.name}" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;" onerror="this.src='./logo.png'">
                </div>
                <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                    <div style="font-size: 0.85rem; color: var(--secondary-gray); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 0.5rem;">${item.category}</div>
                    <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">${item.name}</h3>
                    <div style="font-weight: 700; color: var(--primary-black); font-size: 1.1rem;">₹${item.price.toLocaleString('en-IN')}</div>
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
                shopGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;"><p style="font-size: 1.2rem; color: var(--secondary-gray);">No items match your filter.</p></div>';
                return;
            }

            shopGrid.innerHTML = items.map(item => {
                const sizeOptions = item.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
                return `
                <div class="product-card" style="background: var(--white); border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                    <div style="position: relative; padding-top: 100%; background: #eae8e1;">
                        <img src="${item.image}" alt="${item.name}" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;" onerror="this.src='./logo.png'">
                    </div>
                    <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                        <div style="font-size: 0.85rem; color: var(--secondary-gray); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 0.5rem;">${item.category}</div>
                        <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">${item.name}</h3>
                        <div style="font-weight: 700; color: var(--primary-black); font-size: 1.1rem; margin-bottom: 1rem;">₹${item.price.toLocaleString('en-IN')}</div>
                        
                        <div style="margin-top: auto;">
                            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; display: block;">Select Size <a href="size-guide.html" style="text-decoration: underline; color: var(--secondary-gray); font-size: 0.75rem; font-weight: 400; float: right;">Size Guide</a></label>
                            <select id="size-${item.id}" style="margin-bottom: 1rem;">
                                <option value="" disabled selected>Choose a size</option>
                                ${sizeOptions}
                            </select>
                            <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                                <button onclick="window.handleAdd('${item.id}', this)" class="btn btn-gold" style="width: 100%;"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                                <button onclick="window.handleBuyNow('${item.id}', this)" class="btn btn-black" style="width: 100%;"><i class="fab fa-whatsapp"></i> Buy Now</button>
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

// Since onclick in HTML runs in global scope, we expose these logic handlers here.
window.handleAdd = (id, btnContext) => {
    // Relative find since there could be multiple ID matches if we repeat it
    let sizeSelect = document.getElementById(`size-${id}`);
    if (btnContext) {
      sizeSelect = btnContext.parentElement.parentElement.querySelector('select');
    }
    if (!sizeSelect || !sizeSelect.value) return alert("Please select a size");
    const size = sizeSelect.value;
    const product = typeof productsData !== 'undefined' ? productsData.find(p => p.id === id) : null;
    if (product) addToCart(product, size, 1);
};

window.handleBuyNow = (id, btnContext) => {
    let sizeSelect = document.getElementById(`size-${id}`);
    if (btnContext) {
      sizeSelect = btnContext.parentElement.parentElement.querySelector('select');
    }
    if (!sizeSelect || !sizeSelect.value) return alert("Please select a size");
    const size = sizeSelect.value;
    const product = typeof productsData !== 'undefined' ? productsData.find(p => p.id === id) : null;
    if (product) buyNowSingle(product, size);
};
