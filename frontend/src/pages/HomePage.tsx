import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useData } from "../contexts/DataContext";
import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";
import { useActiveProducts, useSortedProducts } from "../hooks";

export function HomePage() {
  const { products, isLoading } = useData();
  const navigate = useNavigate();

  // Get active products sorted by newest first
  const activeProductsUnsorted = useActiveProducts(products);
  const sortedProducts = useSortedProducts(activeProductsUnsorted);
  
  // Limit initial render to first 12 products for performance
  const activeProducts = sortedProducts.slice(0, 12);

  // Navigate to product detail page
  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  return (
    <main style={{ width: '100%', minHeight: 'calc(100vh - 56px)', paddingTop: '32px', paddingBottom: '32px' }}>
      <div className="container-centered">
        <div style={{ maxWidth: '100%' }}>
          {/* Page header */}
          <div style={{ 
            marginBottom: '32px', 
            paddingBottom: '24px', 
            borderBottom: '1px solid #CBCAC7',
            textAlign: 'center'
          }} className="animate-fade-in">
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              marginBottom: '12px', 
              color: '#1C3D51',
              fontFamily: '"Architects Daughter", cursive',
              letterSpacing: '1px',
              lineHeight: '1.2',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
            }} className="animate-slide-left">
              Featured Products
            </h2>
            <p style={{ 
              fontSize: '24px', 
              color: '#333333',
              fontFamily: '"Architects Daughter", cursive',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
            }} className="animate-slide-right">
              Today's Picks
            </p>
          </div>

          {/* Products grid with staggered animation */}
          {isLoading && products.length === 0 ? (
            <div className="profile-product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : activeProducts.length > 0 ? (
            <div className="profile-product-grid">
              {activeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  location={product.location}
                  image={product.image}
                  condition={product.condition}
                  onClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          ) : (
            // Empty state for no products
            <div style={{ 
              textAlign: 'center', 
              padding: '64px 16px', 
              borderRadius: '8px', 
              border: '1px solid #CBCAC7',
              backgroundColor: '#E3DED7' 
            }}>
              <p style={{ fontSize: '18px', color: '#66655F' }}>
                No products available at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

