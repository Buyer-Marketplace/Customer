import React, { useState } from 'react';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import CartItem from '../components/features/CartItem';
import OrderSummary from '../components/features/OrderSummary';
import ProductCard from '../components/features/ProductCard';
import { cartItems as initialCartItems, products } from '../data/products';

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg py-12 transition-colors duration-300">
      <Container>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              {cartItems.length > 0 ? (
                <div className="divide-y divide-light-border dark:divide-dark-border">
                  {cartItems.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 dark:text-dark-muted mb-6">
                    Start adding some fresh produce to your order!
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                  >
                    Continue Shopping
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={cartItems} />
          </div>
        </div>

        {/* Others are pre-ordering section */}
        {cartItems.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Others are pre-ordering
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map(product => (
                <div key={product.id} className="text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-primary text-sm">${product.price}/{product.unit}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};

export default Cart;