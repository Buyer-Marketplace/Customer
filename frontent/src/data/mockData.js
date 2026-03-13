// ========== CENTRALIZED MOCK DATA ==========
// This file contains all mock data for the application
// When backend is ready, only the API files need to be updated

// ========== HELPER FUNCTIONS FOR DATES ==========

// Get date string with current year
const getCurrentYearDate = (month, day) => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Get ISO string with current year
const getCurrentYearISO = (month, day, hours = 0, minutes = 0, seconds = 0) => {
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, month - 1, day, hours, minutes, seconds).toISOString();
};

// Get date relative to today (for dynamic content)
const getRelativeDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Get ISO string relative to today
const getRelativeISO = (daysFromNow, hours = 0, minutes = 0, seconds = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, seconds);
  return date.toISOString();
};

// ========== MOCK CATEGORIES ==========
export const mockCategories = [
  { 
    id: 1, 
    name: 'Vegetables', 
    description: 'Fresh, organic vegetables directly from local farms',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&q=80&w=600',
    productCount: 25,
    slug: 'vegetables',
    icon: 'GiCarrot',
    color: 'green'
  },
  { 
    id: 2, 
    name: 'Fruits', 
    description: 'Seasonal fruits picked at peak ripeness',
    image: 'https://images.unsplash.com/photo-1619566639371-57ce5024522c?auto=format&fit=crop&q=80&w=600',
    productCount: 18,
    slug: 'fruits',
    icon: 'GiFruitTree',
    color: 'yellow'
  },
  { 
    id: 3, 
    name: 'Grains & Cereals', 
    description: 'High-quality grains and cereals',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    productCount: 15,
    slug: 'grains',
    icon: 'GiWheat',
    color: 'amber'
  },
  { 
    id: 4, 
    name: 'Dairy', 
    description: 'Fresh dairy products from grass-fed cows',
    image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=600',
    productCount: 12,
    slug: 'dairy',
    icon: 'GiCow',
    color: 'blue'
  },
  { 
    id: 5, 
    name: 'Livestock', 
    description: 'Healthy livestock and poultry',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
    productCount: 8,
    slug: 'livestock',
    icon: 'GiChicken',
    color: 'orange'
  },
  { 
    id: 6, 
    name: 'Seeds', 
    description: 'High-quality seeds for planting',
    image: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=600',
    productCount: 10,
    slug: 'seeds',
    icon: 'GiAppleSeeds',
    color: 'green'
  },
  { 
    id: 7, 
    name: 'Organic', 
    description: 'Certified organic produce',
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&q=80&w=600',
    productCount: 20,
    slug: 'organic',
    icon: 'GiSunflower',
    color: 'green'
  },
  { 
    id: 8, 
    name: 'Tools & Equipment', 
    description: 'Farm tools and equipment',
    image: 'https://images.unsplash.com/photo-1416870213587-7980fe336d74?auto=format&fit=crop&q=80&w=600',
    productCount: 15,
    slug: 'tools',
    icon: 'GiPlantWatering',
    color: 'gray'
  },
  { 
    id: 9, 
    name: 'Herbs & Spices', 
    description: 'Fresh herbs and aromatic spices',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600',
    productCount: 12,
    slug: 'herbs',
    icon: 'GiHerbsBundle',
    color: 'green'
  },
  { 
    id: 10, 
    name: 'Nuts & Seeds', 
    description: 'Premium nuts and seeds',
    image: 'https://images.unsplash.com/photo-1542992015-5a3a5c4b6f1d?auto=format&fit=crop&q=80&w=600',
    productCount: 10,
    slug: 'nuts',
    icon: 'GiCorn',
    color: 'amber'
  },
  { 
    id: 11, 
    name: 'Beverages', 
    description: 'Fresh juices and traditional beverages',
    image: 'https://images.unsplash.com/photo-1542992015-5a3a5c4b6f1d?auto=format&fit=crop&q=80&w=600',
    productCount: 8,
    slug: 'beverages',
    icon: 'GiCoffeeBeans',
    color: 'yellow'
  },
  { 
    id: 12, 
    name: 'Honey & Bee Products', 
    description: 'Pure honey and bee products',
    image: 'https://images.unsplash.com/photo-1587049352847-81a56d002c9d?auto=format&fit=crop&q=80&w=600',
    productCount: 6,
    slug: 'honey',
    icon: 'GiHoneycomb',
    color: 'amber'
  },
];

// ========== MOCK FARMERS ==========
export const mockFarmers = [
  {
    id: 1,
    name: 'John Mwangi',
    farmName: 'Green Valley Farm',
    location: 'Nakuru',
    rating: 4.8,
    totalProducts: 15,
    memberSince: getCurrentYearDate(1, 15),
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    description: 'Family-owned farm specializing in organic vegetables',
    verified: true,
    phone: '+254712345678',
    email: 'john@greenvalley.com'
  },
  {
    id: 2,
    name: 'Mary Wanjiku',
    farmName: 'Highlands Farm',
    location: 'Eldoret',
    rating: 4.9,
    totalProducts: 20,
    memberSince: getCurrentYearDate(2, 10),
    image: 'https://images.unsplash.com/photo-1494790108777-766d1e6f9b8a?auto=format&fit=crop&w=200&h=200&q=80',
    description: 'Sustainable farming practices, specializing in grains and dairy',
    verified: true,
    phone: '+254723456789',
    email: 'mary@highlands.com'
  },
  {
    id: 3,
    name: 'Peter Kimani',
    farmName: 'Berry Fields',
    location: 'Kinangop',
    rating: 4.7,
    totalProducts: 12,
    memberSince: getCurrentYearDate(3, 5),
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    description: 'Berry and fruit specialist, practicing organic farming',
    verified: true,
    phone: '+254734567891',
    email: 'peter@berryfields.com'
  }
];

// ========== MOCK PRODUCTS ==========
export const mockProducts = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    description: 'Juicy, ripe tomatoes grown organically without pesticides. Perfect for salads, cooking, or fresh eating.',
    price: 150,
    unit: 'kg',
    availableQuantity: 50,
    totalQuantity: 100,
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1546474372-957d3e4c5f7a?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1577732024841-fd7b61e9f677?auto=format&fit=crop&w=400'
    ],
    category: { id: 1, name: 'Vegetables', slug: 'vegetables' },
    farmer: mockFarmers[0],
    harvestDate: getCurrentYearDate(4, 15),
    isOrganic: true,
    isPreorder: false,
    featured: true,
    createdAt: getCurrentYearISO(3, 15, 10, 0, 0),
    nutritionInfo: {
      calories: '18 kcal',
      protein: '0.9g',
      carbohydrates: '3.9g',
      fat: '0.2g'
    },
    reviews: [
      { id: 1, user: 'Customer1', rating: 5, comment: 'Very fresh!', date: getCurrentYearDate(4, 10) }
    ]
  },
  {
    id: 2,
    name: 'Sweet Corn',
    description: 'Fresh sweet corn harvested at peak ripeness. Great for boiling, grilling, or roasting.',
    price: 80,
    unit: 'piece',
    availableQuantity: 200,
    totalQuantity: 500,
    images: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1582486472100-aad9f8e1e78e?auto=format&fit=crop&w=400'
    ],
    category: { id: 1, name: 'Vegetables', slug: 'vegetables' },
    farmer: mockFarmers[1],
    harvestDate: getCurrentYearDate(4, 20),
    isOrganic: false,
    isPreorder: true,
    featured: true,
    createdAt: getCurrentYearISO(3, 20, 14, 30, 0),
    nutritionInfo: {
      calories: '86 kcal',
      protein: '3.2g',
      carbohydrates: '19g',
      fat: '1.2g'
    }
  },
  {
    id: 3,
    name: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries picked fresh daily. Perfect for desserts, jams, or fresh eating.',
    price: 300,
    unit: 'punnet',
    availableQuantity: 30,
    totalQuantity: 50,
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1587393855524-087ff6834f11?auto=format&fit=crop&w=400'
    ],
    category: { id: 2, name: 'Fruits', slug: 'fruits' },
    farmer: mockFarmers[2],
    harvestDate: getCurrentYearDate(4, 10),
    isOrganic: true,
    isPreorder: false,
    featured: true,
    createdAt: getCurrentYearISO(3, 10, 9, 15, 0),
    nutritionInfo: {
      calories: '32 kcal',
      protein: '0.7g',
      carbohydrates: '7.7g',
      fat: '0.3g'
    }
  },
  {
    id: 4,
    name: 'Irish Potatoes',
    description: 'High-quality Irish potatoes. Versatile for boiling, mashing, frying, or roasting.',
    price: 100,
    unit: 'kg',
    availableQuantity: 1000,
    totalQuantity: 2000,
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1587049352847-81a56d002c9d?auto=format&fit=crop&w=400'
    ],
    category: { id: 1, name: 'Vegetables', slug: 'vegetables' },
    farmer: mockFarmers[1],
    harvestDate: getCurrentYearDate(5, 1),
    isOrganic: false,
    isPreorder: true,
    featured: false,
    createdAt: getCurrentYearISO(4, 1, 11, 20, 0),
    nutritionInfo: {
      calories: '77 kcal',
      protein: '2g',
      carbohydrates: '17g',
      fat: '0.1g'
    }
  },
  {
    id: 5,
    name: 'Fresh Avocados',
    description: 'Creamy, ripe avocados. Perfect for guacamole, salads, or toast.',
    price: 200,
    unit: 'kg',
    availableQuantity: 150,
    totalQuantity: 300,
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1580655653885-aa63e0d259a4?auto=format&fit=crop&w=400'
    ],
    category: { id: 2, name: 'Fruits', slug: 'fruits' },
    farmer: mockFarmers[0],
    harvestDate: getCurrentYearDate(4, 25),
    isOrganic: true,
    isPreorder: true,
    featured: true,
    createdAt: getCurrentYearISO(3, 25, 16, 45, 0),
    nutritionInfo: {
      calories: '160 kcal',
      protein: '2g',
      carbohydrates: '8.5g',
      fat: '14.7g'
    }
  },
  {
    id: 6,
    name: 'Pure Honey',
    description: '100% pure, raw honey from our beehives. Unprocessed and full of natural goodness.',
    price: 500,
    unit: '500ml',
    availableQuantity: 40,
    totalQuantity: 60,
    images: [
      'https://images.unsplash.com/photo-1587049352847-81a56d002c9d?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=400'
    ],
    category: { id: 12, name: 'Honey & Bee Products', slug: 'honey' },
    farmer: mockFarmers[1],
    harvestDate: getCurrentYearDate(4, 30),
    isOrganic: true,
    isPreorder: false,
    featured: false,
    createdAt: getCurrentYearISO(4, 2, 13, 10, 0),
    nutritionInfo: {
      calories: '304 kcal',
      protein: '0.3g',
      carbohydrates: '82g',
      fat: '0g'
    }
  },
  {
    id: 7,
    name: 'Organic Kale',
    description: 'Fresh, nutrient-rich kale grown organically. Perfect for salads, smoothies, or sautés.',
    price: 80,
    unit: 'bunch',
    availableQuantity: 60,
    totalQuantity: 100,
    images: [
      'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1551189014-5500ef59bcb9?auto=format&fit=crop&w=400'
    ],
    category: { id: 7, name: 'Organic', slug: 'organic' },
    farmer: mockFarmers[0],
    harvestDate: getCurrentYearDate(4, 18),
    isOrganic: true,
    isPreorder: false,
    featured: true,
    createdAt: getCurrentYearISO(3, 18, 10, 30, 0),
    nutritionInfo: {
      calories: '49 kcal',
      protein: '4.3g',
      carbohydrates: '8.8g',
      fat: '0.9g'
    }
  },
  {
    id: 8,
    name: 'Free-Range Eggs',
    description: 'Fresh eggs from free-range chickens. Rich in flavor and nutrition.',
    price: 350,
    unit: 'tray',
    availableQuantity: 30,
    totalQuantity: 50,
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400'
    ],
    category: { id: 5, name: 'Livestock', slug: 'livestock' },
    farmer: mockFarmers[2],
    harvestDate: getCurrentYearDate(4, 16),
    isOrganic: true,
    isPreorder: false,
    featured: true,
    createdAt: getCurrentYearISO(3, 16, 14, 20, 0),
    nutritionInfo: {
      calories: '155 kcal per egg',
      protein: '13g',
      carbohydrates: '1.1g',
      fat: '11g'
    }
  }
];

// ========== MOCK ORDERS ==========
export const mockOrders = [
  {
    id: 'ORD-001',
    userId: 1,
    items: [
      { productId: 1, quantity: 2, price: 150, name: 'Fresh Organic Tomatoes' },
      { productId: 3, quantity: 1, price: 300, name: 'Fresh Strawberries' }
    ],
    totalAmount: 600,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: getCurrentYearISO(3, 1, 10, 30, 0),
    updatedAt: getCurrentYearISO(3, 3, 14, 20, 0),
    shippingAddress: '123 Nairobi Street, Nairobi',
    timeline: [
      { status: 'Order Placed', date: getCurrentYearDate(3, 1), completed: true },
      { status: 'Order Confirmed', date: getCurrentYearDate(3, 1), completed: true },
      { status: 'Processing', date: getCurrentYearDate(3, 2), completed: true },
      { status: 'Shipped', date: getCurrentYearDate(3, 2), completed: true },
      { status: 'Delivered', date: getCurrentYearDate(3, 3), completed: true }
    ]
  },
  {
    id: 'ORD-002',
    userId: 1,
    items: [
      { productId: 5, quantity: 3, price: 200, name: 'Fresh Avocados' },
      { productId: 8, quantity: 2, price: 350, name: 'Free-Range Eggs' }
    ],
    totalAmount: 1300,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: getCurrentYearISO(3, 10, 15, 45, 0),
    updatedAt: getCurrentYearISO(3, 12, 9, 30, 0),
    shippingAddress: '123 Nairobi Street, Nairobi',
    timeline: [
      { status: 'Order Placed', date: getCurrentYearDate(3, 10), completed: true },
      { status: 'Order Confirmed', date: getCurrentYearDate(3, 10), completed: true },
      { status: 'Processing', date: getCurrentYearDate(3, 11), completed: true },
      { status: 'Shipped', date: getCurrentYearDate(3, 12), completed: true },
      { status: 'Delivered', date: null, completed: false }
    ]
  },
  {
    id: 'ORD-003',
    userId: 1,
    items: [
      { productId: 2, quantity: 10, price: 80, name: 'Sweet Corn' },
      { productId: 6, quantity: 1, price: 500, name: 'Pure Honey' }
    ],
    totalAmount: 1300,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: getCurrentYearISO(3, 15, 11, 20, 0),
    updatedAt: getCurrentYearISO(3, 15, 11, 20, 0),
    shippingAddress: '123 Nairobi Street, Nairobi',
    timeline: [
      { status: 'Order Placed', date: getCurrentYearDate(3, 15), completed: true },
      { status: 'Order Confirmed', date: null, completed: false }
    ]
  }
];

// ========== MOCK PREORDERS ==========
export const mockPreOrders = [
  {
    id: 'PRE-001',
    productId: 2,
    product: mockProducts[1], // Sweet Corn
    farmer: mockFarmers[1],
    quantity: 50,
    totalPrice: 4000,
    expectedHarvestDate: getCurrentYearDate(5, 15),
    orderDeadline: getCurrentYearDate(5, 10),
    status: 'open',
    createdAt: getCurrentYearISO(4, 1, 10, 0, 0),
    minOrder: 10,
    maxOrder: 100,
    availableQuantity: 500,
  },
  {
    id: 'PRE-002',
    productId: 4,
    product: mockProducts[3], // Irish Potatoes
    farmer: mockFarmers[1],
    quantity: 200,
    totalPrice: 20000,
    expectedHarvestDate: getCurrentYearDate(5, 20),
    orderDeadline: getCurrentYearDate(5, 15),
    status: 'open',
    createdAt: getCurrentYearISO(4, 2, 14, 30, 0),
    minOrder: 50,
    maxOrder: 500,
    availableQuantity: 1000,
  },
  {
    id: 'PRE-003',
    productId: 5,
    product: mockProducts[4], // Fresh Avocados
    farmer: mockFarmers[0],
    quantity: 30,
    totalPrice: 6000,
    expectedHarvestDate: getCurrentYearDate(5, 25),
    orderDeadline: getCurrentYearDate(5, 20),
    status: 'open',
    createdAt: getCurrentYearISO(4, 3, 9, 15, 0),
    minOrder: 5,
    maxOrder: 50,
    availableQuantity: 150,
  },
  {
    id: 'PRE-004',
    productId: 1,
    product: mockProducts[0], // Fresh Organic Tomatoes
    farmer: mockFarmers[0],
    quantity: 25,
    totalPrice: 3750,
    expectedHarvestDate: getCurrentYearDate(5, 5),
    orderDeadline: getCurrentYearDate(4, 30),
    status: 'fulfilled',
    createdAt: getCurrentYearISO(3, 15, 11, 20, 0),
    minOrder: 5,
    maxOrder: 100,
    availableQuantity: 50,
  },
  {
    id: 'PRE-005',
    productId: 3,
    product: mockProducts[2], // Fresh Strawberries
    farmer: mockFarmers[2],
    quantity: 15,
    totalPrice: 4500,
    expectedHarvestDate: getCurrentYearDate(5, 30),
    orderDeadline: getCurrentYearDate(5, 25),
    status: 'open',
    createdAt: getCurrentYearISO(4, 5, 16, 45, 0),
    minOrder: 5,
    maxOrder: 30,
    availableQuantity: 50,
  },
  {
    id: 'PRE-006',
    productId: 6,
    product: mockProducts[5], // Pure Honey
    farmer: mockFarmers[1],
    quantity: 10,
    totalPrice: 5000,
    expectedHarvestDate: getCurrentYearDate(6, 10),
    orderDeadline: getCurrentYearDate(6, 5),
    status: 'open',
    createdAt: getCurrentYearISO(4, 7, 13, 10, 0),
    minOrder: 2,
    maxOrder: 20,
    availableQuantity: 40,
  },
];

// ========== MOCK USER PREORDERS ==========
export const mockUserPreorders = [
  {
    id: 'PRE-101',
    product: mockProducts[1],
    farmer: mockFarmers[1],
    quantity: 20,
    totalPrice: 1600,
    expectedHarvestDate: getCurrentYearDate(5, 15),
    orderDate: getCurrentYearISO(4, 10, 9, 30, 0),
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'PRE-102',
    product: mockProducts[4],
    farmer: mockFarmers[0],
    quantity: 10,
    totalPrice: 2000,
    expectedHarvestDate: getCurrentYearDate(5, 25),
    orderDate: getCurrentYearISO(4, 12, 14, 15, 0),
    status: 'pending',
    paymentStatus: 'pending',
  },
];

// ========== MOCK HARVEST CALENDAR ==========
export const mockHarvestCalendar = {
  [getCurrentYearDate(4, 15)]: [
    { product: mockProducts[0], quantity: 100 }, // Tomatoes
    { product: mockProducts[2], quantity: 50 },  // Strawberries
  ],
  [getCurrentYearDate(4, 20)]: [
    { product: mockProducts[1], quantity: 500 }, // Sweet Corn
  ],
  [getCurrentYearDate(4, 25)]: [
    { product: mockProducts[4], quantity: 300 }, // Avocados
  ],
  [getCurrentYearDate(4, 30)]: [
    { product: mockProducts[5], quantity: 60 },  // Honey
  ],
  [getCurrentYearDate(5, 1)]: [
    { product: mockProducts[3], quantity: 2000 }, // Potatoes
  ],
};

// ========== MOCK HEADER IMAGES ==========
export const mockHeaderImages = {
  hero: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600",
  trust: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1600",
  featured: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600",
  categories: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600",
  testimonials: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=1600",
  products: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600",
  preorder: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600",
};

// ========== MOCK TESTIMONIALS ==========
export const mockTestimonials = [
  {
    id: 1,
    name: "John Mwangi",
    text: "The freshest produce I've ever bought! Direct from farmers, delivered to my doorstep within hours.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    location: "Nairobi"
  },
  {
    id: 2,
    name: "Mary Wanjiku",
    text: "I love being able to pre-order harvests. The quality is amazing and the prices are fair.",
    image: "https://images.unsplash.com/photo-1494790108777-766d1e6f9b8a?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    location: "Kisumu"
  },
  {
    id: 3,
    name: "Peter Kimani",
    text: "Agritrace Market has changed how I shop for food. Fresh, organic, and supporting local farmers.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
    location: "Mombasa"
  }
];

// ========== UTILITY FUNCTIONS FOR WORKING WITH MOCK DATA ==========
export const mockDataUtils = {
  // Filter products based on params
  filterProducts: (products, params = {}) => {
    let filtered = [...products];

    if (params.category) {
      filtered = filtered.filter(p => p.category.id === parseInt(params.category));
    }

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.farmer?.farmName?.toLowerCase().includes(searchTerm)
      );
    }

    if (params.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(params.minPrice));
    }

    if (params.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(params.maxPrice));
    }

    if (params.organic === 'true') {
      filtered = filtered.filter(p => p.isOrganic);
    }

    if (params.featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    if (params.sort) {
      switch (params.sort) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
    }

    return filtered;
  },

  // Paginate products
  paginateProducts: (products, page = 1, limit = 12) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalProducts: products.length,
      totalPages: Math.ceil(products.length / limit),
      currentPage: page,
    };
  },

  // Get category by ID
  getCategoryById: (id) => {
    return mockCategories.find(c => c.id === parseInt(id));
  },

  // Get product by ID
  getProductById: (id) => {
    return mockProducts.find(p => p.id === parseInt(id));
  },

  // Get products by category ID
  getProductsByCategory: (categoryId) => {
    return mockProducts.filter(p => p.category.id === parseInt(categoryId));
  },

  // Get farmer by ID
  getFarmerById: (id) => {
    return mockFarmers.find(f => f.id === parseInt(id));
  },

  // Get preorder by ID
  getPreorderById: (id) => {
    return mockPreOrders.find(p => p.id === id) || mockUserPreorders.find(p => p.id === id);
  },

  // Get featured products
  getFeaturedProducts: (limit = 8) => {
    return mockProducts.filter(p => p.featured).slice(0, limit);
  },

  // Get new products (sorted by harvest date)
  getNewProducts: (limit = 8) => {
    return [...mockProducts]
      .sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))
      .slice(0, limit);
  },

  // Get available preorders
  getAvailablePreorders: () => {
    return mockPreOrders.filter(p => p.status === 'open');
  },

  // Get order statistics
  getOrderStats: (orders) => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  },

  // Calculate days until deadline
  getDaysUntil: (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Format date for display
  formatDate: (dateString, format = 'short') => {
    const date = new Date(dateString);
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};