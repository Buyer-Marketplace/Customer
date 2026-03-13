import { 
  mockCategories, 
  mockProducts, 
  mockFarmers, 
  mockOrders, 
  mockPreOrders,
  mockHarvestCalendar 
} from './mockData';

// Helper functions
const paginate = (data, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = data.slice(start, end);
  
  return {
    products: paginatedData,
    totalPages: Math.ceil(data.length / limit),
    currentPage: page,
    total: data.length
  };
};

const filterProducts = (products, params) => {
  let filtered = [...products];
  
  if (params.category) {
    filtered = filtered.filter(p => p.category.id === parseInt(params.category));
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm)
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
    }
  }
  
  return filtered;
};

export const setupMockInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(async (config) => {
    // Only use mock in development
    if (!import.meta.env.DEV) {
      return config;
    }

    console.log(`🔄 Mock API: ${config.method?.toUpperCase()} ${config.url}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // ============ AUTH ENDPOINTS ============
    if (config.url === '/auth/login' && config.method === 'post') {
      const { email, password } = JSON.parse(config.data);
      if (email && password) {
        return Promise.reject({
          mockResponse: {
            data: {
              token: 'mock-jwt-token-12345',
              user: {
                id: 1,
                name: 'John Doe',
                email: email,
                role: 'buyer'
              }
            }
          }
        });
      }
    }

    if (config.url === '/auth/register' && config.method === 'post') {
      const userData = JSON.parse(config.data);
      return Promise.reject({
        mockResponse: {
          data: {
            token: 'mock-jwt-token-12345',
            user: {
              id: 2,
              ...userData,
              role: 'buyer'
            }
          }
        }
      });
    }

    if (config.url === '/auth/profile' && config.method === 'get') {
      return Promise.reject({
        mockResponse: {
          data: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'buyer'
          }
        }
      });
    }

    // ============ CATEGORIES ENDPOINTS ============
    if (config.url === '/categories' && config.method === 'get') {
      return Promise.reject({
        mockResponse: {
          data: mockCategories
        }
      });
    }

    if (config.url.match(/^\/categories\/\d+$/) && config.method === 'get') {
      const id = parseInt(config.url.split('/')[2]);
      const category = mockCategories.find(c => c.id === id);
      return Promise.reject({
        mockResponse: {
          data: category
        }
      });
    }

    if (config.url.match(/^\/categories\/\d+\/products$/) && config.method === 'get') {
      const id = parseInt(config.url.split('/')[2]);
      const categoryProducts = mockProducts.filter(p => p.category.id === id);
      const params = config.params || {};
      const filtered = filterProducts(categoryProducts, params);
      const page = params.page || 1;
      const limit = params.limit || 10;
      
      return Promise.reject({
        mockResponse: {
          data: paginate(filtered, page, limit)
        }
      });
    }

    // ============ PRODUCTS ENDPOINTS ============
    if (config.url === '/products' && config.method === 'get') {
      const params = config.params || {};
      const filtered = filterProducts(mockProducts, params);
      const page = params.page || 1;
      const limit = params.limit || 10;
      
      return Promise.reject({
        mockResponse: {
          data: paginate(filtered, page, limit)
        }
      });
    }

    if (config.url.match(/^\/products\/\d+$/) && config.method === 'get') {
      const id = parseInt(config.url.split('/')[2]);
      const product = mockProducts.find(p => p.id === id);
      return Promise.reject({
        mockResponse: {
          data: product
        }
      });
    }

    if (config.url === '/products/harvest-calendar' && config.method === 'get') {
      const { month, year } = config.params;
      const filtered = {};
      Object.entries(mockHarvestCalendar).forEach(([date, products]) => {
        const d = new Date(date);
        if (d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year)) {
          filtered[date] = products;
        }
      });
      return Promise.reject({
        mockResponse: {
          data: filtered
        }
      });
    }

    // ============ FARMERS ENDPOINTS ============
    if (config.url === '/farmers' && config.method === 'get') {
      return Promise.reject({
        mockResponse: {
          data: mockFarmers
        }
      });
    }

    if (config.url.match(/^\/farmers\/\d+$/) && config.method === 'get') {
      const id = parseInt(config.url.split('/')[2]);
      const farmer = mockFarmers.find(f => f.id === id);
      return Promise.reject({
        mockResponse: {
          data: farmer
        }
      });
    }

    if (config.url.match(/^\/farmers\/\d+\/products$/) && config.method === 'get') {
      const id = parseInt(config.url.split('/')[2]);
      const farmerProducts = mockProducts.filter(p => p.farmer.id === id);
      return Promise.reject({
        mockResponse: {
          data: farmerProducts
        }
      });
    }

    // ============ ORDERS ENDPOINTS ============
    if (config.url === '/orders' && config.method === 'post') {
      const orderData = JSON.parse(config.data);
      const newOrder = {
        id: `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        paymentStatus: 'pending',
        ...orderData,
        timeline: [
          { status: 'Order Placed', date: new Date().toISOString().split('T')[0], completed: true }
        ]
      };
      mockOrders.push(newOrder);
      return Promise.reject({
        mockResponse: {
          data: newOrder
        }
      });
    }

    if (config.url === '/orders' && config.method === 'get') {
      return Promise.reject({
        mockResponse: {
          data: mockOrders
        }
      });
    }

    if (config.url.match(/^\/orders\/ORD-\d+$/) && config.method === 'get') {
      const id = config.url.split('/')[2];
      const order = mockOrders.find(o => o.id === id);
      return Promise.reject({
        mockResponse: {
          data: order
        }
      });
    }

    if (config.url.match(/^\/orders\/\d+\/cancel$/) && config.method === 'put') {
      const id = config.url.split('/')[2];
      const order = mockOrders.find(o => o.id === id);
      if (order) {
        order.status = 'cancelled';
      }
      return Promise.reject({
        mockResponse: {
          data: order
        }
      });
    }

    // ============ PREORDERS ENDPOINTS ============
    if (config.url === '/preorders' && config.method === 'post') {
      const preorderData = JSON.parse(config.data);
      const newPreorder = {
        id: `PRE-${String(mockPreOrders.length + 1).padStart(3, '0')}`,
        ...preorderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      mockPreOrders.push(newPreorder);
      return Promise.reject({
        mockResponse: {
          data: newPreorder
        }
      });
    }

    if (config.url === '/preorders' && config.method === 'get') {
      return Promise.reject({
        mockResponse: {
          data: mockPreOrders
        }
      });
    }

    if (config.url === '/preorders/available' && config.method === 'get') {
      const available = mockProducts.filter(p => p.isPreorder);
      return Promise.reject({
        mockResponse: {
          data: available
        }
      });
    }

    if (config.url.match(/^\/preorders\/PRE-\d+$/) && config.method === 'get') {
      const id = config.url.split('/')[2];
      const preorder = mockPreOrders.find(p => p.id === id);
      return Promise.reject({
        mockResponse: {
          data: preorder
        }
      });
    }

    if (config.url.match(/^\/preorders\/PRE-\d+\/cancel$/) && config.method === 'put') {
      const id = config.url.split('/')[2];
      const preorder = mockPreOrders.find(p => p.id === id);
      if (preorder) {
        preorder.status = 'cancelled';
      }
      return Promise.reject({
        mockResponse: {
          data: preorder
        }
      });
    }

    // If no mock matches, proceed with actual request
    return config;
  });
};