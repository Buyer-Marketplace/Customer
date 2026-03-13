// Mock Categories with reliable image URLs
export const mockCategories = [
  { 
    id: 1, 
    name: 'Vegetables', 
    image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=600', 
    description: 'Fresh, organic vegetables directly from local farms',
    productCount: 25 
  },
  { 
    id: 2, 
    name: 'Fruits', 
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600', 
    description: 'Seasonal fruits picked at peak ripeness',
    productCount: 18 
  },
  { 
    id: 3, 
    name: 'Grains', 
    image: 'https://images.pexels.com/photos/129577/pexels-photo-129577.jpeg?auto=compress&cs=tinysrgb&w=600', 
    description: 'High-quality grains and cereals',
    productCount: 15 
  },
  { 
    id: 4, 
    name: 'Dairy', 
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600', 
    description: 'Fresh dairy products from grass-fed cows',
    productCount: 12 
  },
  { 
    id: 5, 
    name: 'Herbs', 
    image: 'https://images.pexels.com/photos/6210872/pexels-photo-6210872.jpeg?auto=compress&cs=tinysrgb&w=600', 
    description: 'Aromatic herbs for cooking and medicinal use',
    productCount: 10 
  },
  { 
    id: 6, 
    name: 'Honey', 
    image: 'https://images.pexels.com/photos/634030/pexels-photo-634030.jpeg?auto=compress&cs=tinysrgb&w=600', 
    description: 'Pure, raw honey from local beekeepers',
    productCount: 8 
  },
];

// Mock Farmers
export const mockFarmers = [
  {
    id: 1,
    name: 'John Mwangi',
    farmName: 'Green Valley Farm',
    email: 'john@greenvalley.com',
    phone: '+254712345678',
    location: 'Nakuru, Kenya',
    bio: 'Passionate about sustainable farming and providing the freshest vegetables to our community.',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/159510/pexels-photo-159510.jpeg?auto=compress&cs=tinysrgb&w=1200',
    rating: 4.8,
    reviewCount: 156,
    productCount: 15,
    followers: 234,
    yearsActive: 8,
    isOrganic: true,
    isVerified: true,
    farmSize: 25,
    established: '2016',
    farmingMethods: 'Organic, Crop Rotation',
    certifications: 'Organic Certified Kenya',
  },
  {
    id: 2,
    name: 'Mary Wanjiku',
    farmName: 'Highlands Farm',
    email: 'mary@highlandsfarm.com',
    phone: '+254723456789',
    location: 'Eldoret, Kenya',
    bio: 'Family-owned farm specializing in grains and vegetables. Quality and sustainability are our priorities.',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/159510/pexels-photo-159510.jpeg?auto=compress&cs=tinysrgb&w=1200',
    rating: 4.6,
    reviewCount: 98,
    productCount: 12,
    followers: 167,
    yearsActive: 12,
    isOrganic: false,
    isVerified: true,
    farmSize: 40,
    established: '2012',
    farmingMethods: 'Integrated Pest Management',
    certifications: 'GlobalG.A.P.',
  },
  {
    id: 3,
    name: 'Peter Kimani',
    farmName: 'Berry Fields',
    email: 'peter@berryfields.com',
    phone: '+254734567890',
    location: 'Kinangop, Kenya',
    bio: 'Specializing in berries and fruits. We bring the freshest berries to your table.',
    profileImage: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/159510/pexels-photo-159510.jpeg?auto=compress&cs=tinysrgb&w=1200',
    rating: 4.9,
    reviewCount: 203,
    productCount: 8,
    followers: 312,
    yearsActive: 5,
    isOrganic: true,
    isVerified: true,
    farmSize: 15,
    established: '2019',
    farmingMethods: 'Organic, Permaculture',
    certifications: 'Organic Certified Kenya',
  },
];

// Mock Products with reliable image URLs
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
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: { id: 1, name: 'Vegetables' },
    farmer: { id: 1, name: 'John Mwangi', farmName: 'Green Valley Farm', location: 'Nakuru, Kenya' },
    harvestDate: '2024-04-15',
    isOrganic: true,
    isPreorder: false,
    featured: true,
    createdAt: '2024-03-01T10:00:00Z'
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
      'https://images.pexels.com/photos/547332/pexels-photo-547332.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/102871/pexels-photo-102871.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: { id: 1, name: 'Vegetables' },
    farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret, Kenya' },
    harvestDate: '2024-04-20',
    isOrganic: false,
    isPreorder: true,
    featured: true,
    createdAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 3,
    name: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries perfect for desserts, jams, or fresh eating. Picked fresh daily.',
    price: 300,
    unit: 'punnet',
    availableQuantity: 30,
    totalQuantity: 50,
    images: [
      'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/59989/strawberries-sweet-fresh-red-59989.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: { id: 2, name: 'Fruits' },
    farmer: { id: 3, name: 'Peter Kimani', farmName: 'Berry Fields', location: 'Kinangop, Kenya' },
    harvestDate: '2024-04-10',
    isOrganic: true,
    isPreorder: false,
    featured: true,
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 4,
    name: 'Irish Potatoes',
    description: 'High-quality Irish potatoes, perfect for chips, mash, or roasting.',
    price: 100,
    unit: 'kg',
    availableQuantity: 1000,
    totalQuantity: 2000,
    images: [
      'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: { id: 1, name: 'Vegetables' },
    farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret, Kenya' },
    harvestDate: '2024-05-01',
    isOrganic: false,
    isPreorder: true,
    featured: false,
    createdAt: '2024-03-12T10:00:00Z'
  },
  {
    id: 5,
    name: 'Fresh Avocados',
    description: 'Creamy, ripe avocados. Great for guacamole, salads, or toast.',
    price: 200,
    unit: 'kg',
    availableQuantity: 150,
    totalQuantity: 300,
    images: [
      'https://images.pexels.com/photos/143176/pexels-photo-143176.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/41120/avocados-food-ripe-fruit-41120.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: { id: 2, name: 'Fruits' },
    farmer: { id: 1, name: 'John Mwangi', farmName: 'Green Valley Farm', location: 'Nakuru, Kenya' },
    harvestDate: '2024-04-25',
    isOrganic: true,
    isPreorder: true,
    featured: true,
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 6,
    name: 'Pure Honey',
    description: '100% pure, raw honey from our beehives. Unprocessed and natural.',
    price: 500,
    unit: '500ml',
    availableQuantity: 40,
    totalQuantity: 60,
    images: [
      'https://images.pexels.com/photos/634030/pexels-photo-634030.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: { id: 6, name: 'Honey' },
    farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret, Kenya' },
    harvestDate: '2024-04-30',
    isOrganic: true,
    isPreorder: false,
    featured: false,
    createdAt: '2024-03-18T10:00:00Z'
  }
];

// Mock Orders
export const mockOrders = [
  {
    id: 'ORD-001',
    createdAt: '2024-03-15T10:30:00Z',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'M-Pesa',
    total: 1250,
    deliveryAddress: '123 Main Street, Nairobi',
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0712345678'
    },
    items: [
      {
        id: 1,
        product: mockProducts[0],
        quantity: 5,
        price: 150,
        subtotal: 750
      },
      {
        id: 2,
        product: mockProducts[2],
        quantity: 2,
        price: 300,
        subtotal: 600
      }
    ],
    timeline: [
      { status: 'Order Placed', date: '2024-03-15', completed: true },
      { status: 'Order Confirmed', date: '2024-03-16', completed: true },
      { status: 'Processing', date: '2024-03-17', completed: true },
      { status: 'Shipped', date: '2024-03-18', completed: true },
      { status: 'Delivered', date: '2024-03-19', completed: true }
    ]
  },
  {
    id: 'ORD-002',
    createdAt: '2024-03-20T14:45:00Z',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    total: 850,
    deliveryAddress: '456 Park Avenue, Mombasa',
    contactInfo: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0723456789'
    },
    items: [
      {
        id: 3,
        product: mockProducts[4],
        quantity: 3,
        price: 200,
        subtotal: 600
      },
      {
        id: 4,
        product: mockProducts[5],
        quantity: 1,
        price: 500,
        subtotal: 500
      }
    ],
    timeline: [
      { status: 'Order Placed', date: '2024-03-20', completed: true },
      { status: 'Order Confirmed', date: '2024-03-21', completed: true },
      { status: 'Processing', date: '2024-03-22', completed: true },
      { status: 'Shipped', date: null, completed: false },
      { status: 'Delivered', date: null, completed: false }
    ]
  }
];

// Mock PreOrders
export const mockPreOrders = [
  {
    id: 'PRE-001',
    product: mockProducts[1],
    quantity: 10,
    deposit: 400,
    status: 'confirmed',
    createdAt: '2024-03-10T09:00:00Z'
  },
  {
    id: 'PRE-002',
    product: mockProducts[4],
    quantity: 5,
    deposit: 500,
    status: 'pending',
    createdAt: '2024-03-18T11:30:00Z'
  }
];

// Mock Harvest Calendar Data
export const mockHarvestCalendar = {
  '2024-04-15': [mockProducts[0]],
  '2024-04-20': [mockProducts[1]],
  '2024-04-10': [mockProducts[2]],
  '2024-05-01': [mockProducts[3]],
  '2024-04-25': [mockProducts[4]],
  '2024-04-30': [mockProducts[5]],
};