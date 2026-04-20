const productsData = [
  {
    id: 'p1',
    name: 'Classic Football Jersey',
    price: 1200,
    category: 'Football',
    sizes: ['S', 'M', 'L', 'XL'],
    image: './assets/dummy/products/product1.png',
    color: 'Blue'
  },
  {
    id: 'p2',
    name: 'Basketball Pro Jersey',
    price: 1500,
    category: 'Basketball',
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: './assets/dummy/products/product2.png',
    color: 'Red'
  },
  {
    id: 'p3',
    name: 'Cricket Team Jersey',
    price: 900,
    category: 'Cricket',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: './assets/dummy/products/product3.png',
    color: 'White'
  },
  {
    id: 'p4',
    name: 'Retro Soccer Jersey',
    price: 1800,
    category: 'Soccer',
    sizes: ['XS', 'S', 'M', 'L'],
    image: './assets/dummy/products/product4.png',
    color: 'Green'
  },
  {
    id: 'p5',
    name: 'Baseball Legend Jersey',
    price: 2200,
    category: 'Baseball',
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: './assets/dummy/products/product5.png',
    color: 'Black'
  },
  {
    id: 'p6',
    name: 'Premium Running Jersey',
    price: 1000,
    category: 'Running',
    sizes: ['S', 'M', 'L'],
    image: './assets/dummy/products/product6.png',
    color: 'Yellow'
  },
  {
    id: 'p7',
    name: 'Premium  Jersey',
    price: 9999,
    category: 'Running',
    sizes: ['S', 'M', 'L'],
    image: './assets/dummy/products/product7.png',
    color: 'White'
  }
];

const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};
