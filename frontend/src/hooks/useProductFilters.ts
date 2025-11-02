import { useState, useMemo, useCallback } from "react";
import { Product } from "../contexts/DataContext";

export interface ProductFilters {
  searchQuery: string;
  categoryFilter: string;
  conditionFilter: string;
  locationFilter: string;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setConditionFilter: (condition: string) => void;
  setLocationFilter: (location: string) => void;
  filteredProducts: Product[];
  uniqueLocations: string[];
  resetFilters: () => void;
}

export function useProductFilters(
  products: Product[],
  initialFilters?: Partial<ProductFilters>
): UseProductFiltersReturn {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || "");
  const [categoryFilter, setCategoryFilter] = useState(initialFilters?.categoryFilter || "all");
  const [conditionFilter, setConditionFilter] = useState(initialFilters?.conditionFilter || "all");
  const [locationFilter, setLocationFilter] = useState(initialFilters?.locationFilter || "all");

  // Extract unique locations
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    products
      .filter((p) => p.status === "active")
      .forEach((p) => locations.add(p.location));
    return Array.from(locations).sort();
  }, [products]);

  // Apply all filters
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === "active")
      .filter((p) => {
        const matchesSearch =
          searchQuery === "" ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || p.category === categoryFilter;

        const matchesCondition =
          conditionFilter === "all" || p.condition === conditionFilter;

        const matchesLocation =
          locationFilter === "all" || p.location === locationFilter;

        return matchesSearch && matchesCategory && matchesCondition && matchesLocation;
      });
  }, [products, searchQuery, categoryFilter, conditionFilter, locationFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setConditionFilter("all");
    setLocationFilter("all");
  }, []);

  return {
    filters: {
      searchQuery,
      categoryFilter,
      conditionFilter,
      locationFilter,
    },
    setSearchQuery,
    setCategoryFilter,
    setConditionFilter,
    setLocationFilter,
    filteredProducts,
    uniqueLocations,
    resetFilters,
  };
}
