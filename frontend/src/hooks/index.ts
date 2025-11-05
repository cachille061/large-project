/**
 * Custom Hooks Index
 * Centralized export for all custom hooks
 */

export { useProductFilters } from "./useProductFilters";
export type { ProductFilters, UseProductFiltersReturn } from "./useProductFilters";

export { useLocalStorage } from "./useLocalStorage";

export { 
  useOrderManagement, 
  useSortedProducts, 
  useActiveProducts 
} from "./useDataFilters";
export type { CategorizedOrders } from "./useDataFilters";
