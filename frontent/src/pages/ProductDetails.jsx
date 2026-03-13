import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductGallery from '../components/product/ProductGallery';
import ProductDetails from '../components/product/ProductDetails';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/ui/Loader';
import { IoArrowBack } from 'react-icons/io5';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProductById(id);
      setProduct(data);
      
      // Fetch related products from same category
      if (data.category) {
        const related = await productApi.getProductsByCategory(data.category.id, { limit: 4 });
        setRelatedProducts(related.products?.filter(p => p.id !== data.id) || []);
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
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-green-200 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <ProductGallery images={product.images} />
          
          {/* Details */}
          <ProductDetails product={product} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;