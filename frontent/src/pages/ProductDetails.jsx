import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductGallery from '../components/product/ProductGallery';
import ProductDetails from '../components/product/ProductDetails';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { IoArrowBack, IoLeaf } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      let data;
      try {
        data = await productApi.getProductById(id);
      } catch (err) {
        console.log('Using mock product data');
        // Find product in mock data
        const mockProducts = productApi.getMockProducts?.() || [];
        data = mockProducts.find(p => p.id === parseInt(id));
        
        if (!data) {
          // Create a default product if not found
          data = {
            id: parseInt(id),
            name: `Product ${id}`,
            description: 'Fresh farm product directly from local farmers.',
            price: 100,
            unit: 'kg',
            availableQuantity: 50,
            totalQuantity: 100,
            images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800'],
            category: { id: 1, name: 'Vegetables' },
            farmer: { 
              id: 1, 
              name: 'John Mwangi', 
              farmName: 'Green Valley Farm', 
              location: 'Nakuru',
              rating: 4.5,
              totalProducts: 15,
              memberSince: '2023-01-15'
            },
            harvestDate: new Date().toISOString().split('T')[0],
            isOrganic: true,
            isPreorder: false,
            featured: false,
            nutritionInfo: {
              calories: '25 kcal',
              protein: '1g',
              carbohydrates: '5g',
              fat: '0g'
            },
            reviews: [
              {
                id: 1,
                user: 'Customer',
                rating: 5,
                comment: 'Excellent quality!',
                date: new Date().toISOString()
              }
            ]
          };
        }
      }
      
      setProduct(data);
      
      // Fetch related products from same category
      if (data.category) {
        try {
          const related = await productApi.getProductsByCategory(data.category.id, { limit: 4 });
          setRelatedProducts(related.products?.filter(p => p.id !== data.id) || []);
        } catch (err) {
          console.log('Using mock related products');
          const mockProducts = productApi.getMockProductsByCategory?.(data.category.id) || [];
          setRelatedProducts(mockProducts.filter(p => p.id !== data.id).slice(0, 4));
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
          <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-green-200 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Small Header for consistency */}
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={headerImage}
          alt="Products"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
      </div>

      <div className="container-custom py-8 -mt-20 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/products" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Main Section */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-green-400/20 shadow-2xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div data-aos="fade-right">
              <ProductGallery images={product.images} />
            </div>
            
            {/* Details */}
            <div data-aos="fade-left">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section data-aos="fade-up">
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div key={relatedProduct.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;