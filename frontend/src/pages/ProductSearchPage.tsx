import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { ProductCard } from "../components/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PRODUCT_CONDITIONS } from "../constants";
import { useProductFilters } from "../hooks";

export function ProductSearchPage() {
  const { products } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize product filtering with custom hook
  const {
    filters: { searchQuery, categoryFilter, conditionFilter, locationFilter },
    setSearchQuery,
    setCategoryFilter,
    setConditionFilter,
    setLocationFilter,
    filteredProducts,
    uniqueLocations: locations,
  } = useProductFilters(products);

  // Sync filters with URL parameters
  useEffect(() => {
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    
    if (query) setSearchQuery(query);
    if (category) {
      setCategoryFilter(category);
    } else {
      setCategoryFilter("all");
    }
  }, [searchParams, setSearchQuery, setCategoryFilter]);

  // Navigate to product detail
  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  return (
    <main className="container-page">
      <div className="container-centered">
        <h2 className="text-heading-secondary">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Browse & Filter Products'}
        </h2>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          {categoryFilter !== "all" 
            ? `Showing ${filteredProducts.length} products in ${categoryFilter}` 
            : searchQuery 
              ? `Found ${filteredProducts.length} products` 
              : 'Search by keyword or filter by category and condition'}
        </p>

        {/* Filters */}
        <div style={{ marginBottom: '24px' }}>
          <div className="flex-wrap" style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '200px', maxWidth: '20rem' }}>
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {PRODUCT_CONDITIONS.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ flex: 1, minWidth: '200px', maxWidth: '20rem' }}>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '16px' }}>
          <p className="text-muted text-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} found
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                location={product.location}
                image={product.image}
                condition={product.condition}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '48px 0' }}>
            <p className="text-muted">No products match your search criteria</p>
          </div>
        )}
      </div>
    </main>
  );
}

