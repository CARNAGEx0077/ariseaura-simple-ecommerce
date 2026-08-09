let productsData = [];
let loadProductsPromise = null;

const loadProducts = () => {
  if (!loadProductsPromise) {
    loadProductsPromise = fetch('./products.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(data => {
        productsData = data;
      })
      .catch(err => {
        console.error('Error loading products:', err);
      });
  }
  return loadProductsPromise;
};

const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};
