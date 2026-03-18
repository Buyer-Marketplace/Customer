import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CropProvider } from './context/CropContext'; // Changed from ProductProvider
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/ui/Loader';

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader 
          size="xl" 
          showLogo={true} 
          text="Welcome to AgriTrace" 
          withSpinner={true}
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CropProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen bg-green-950 transition-colors duration-300">
                <AppRoutes />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#052e16',
                      color: '#fff',
                      border: '1px solid #4ade80',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#4ade80',
                        secondary: '#052e16',
                      },
                    },
                    error: {
                      duration: 4000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </WishlistProvider>
          </CartProvider>
        </CropProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;