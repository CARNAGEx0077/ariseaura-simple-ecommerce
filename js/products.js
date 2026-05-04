const productsData = [
  {
    id: 'p1',
    name: 'Classic Football Jersey',
    price: 249,
    category: 'Football',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product1.png',
    color: 'Blue'
  },
  {
    id: 'p2',
    name: 'Basketball Pro Jersey',
    price: 249,
    category: 'Basketball',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product2.png',
    color: 'Red'
  },
  {
    id: 'p3',
    name: 'Cricket Team Jersey',
    price: 249,
    category: 'Cricket',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product3.png',
    color: 'White'
  },
  {
    id: 'p4',
    name: 'Retro Soccer Jersey',
    price: 249,
    category: 'Soccer',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product4.png',
    color: 'Green'
  },
  {
    id: 'p5',
    name: 'Baseball Legend Jersey',
    price: 249,
    category: 'Baseball',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product5.png',
    color: 'Black'
  },
  {
    id: 'p6',
    name: 'Premium Running Jersey',
    price: 249,
    category: 'Running',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product6.png',
    color: 'Yellow'
  },
  {
    id: 'p7',
    name: 'Premium Sports Jersey',
    price: 249,
    category: 'Running',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product7.png',
    color: 'White'
  },
  {
    id: 'p8',
    name: 'Elite Training Jersey',
    price: 249,
    category: 'Training',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product8.png',
    color: 'Navy'
  },
  {
    id: 'p9',
    name: 'Pro Striker Jersey',
    price: 249,
    category: 'Football',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product9.png',
    color: 'Orange'
  },
  {
    id: 'p10',
    name: 'Champion Edition Jersey',
    price: 249,
    category: 'Basketball',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product10.png',
    color: 'Gold'
  },
  {
    id: 'p11',
    name: 'Baggy Track Pants',
    price: 249,
    category: 'Pants',
    sizes: ['M', 'L', 'XL', '2XL'],
    image: './assets/dummy/products/product11.png',
    color: 'Black'
  }

];

const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};
