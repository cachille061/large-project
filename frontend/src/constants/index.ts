// Central export for all constants
export * from "./categories";
export * from "./theme";
export * from "./styles";

// Application routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  SEARCH: "/search",
  PRODUCT_DETAIL: "/product/:productId",
  ORDERS: "/orders",
  MY_LISTINGS: "/my-listings",
  SELL: "/sell",
  EDIT_PRODUCT: "/edit/:productId",
  PROFILE: "/profile",
} as const;

// Default location options
export const DEFAULT_LOCATIONS = [
  "Orlando, FL",
  "Winter Park, FL",
  "Lake Nona, FL",
  "Kissimmee, FL",
  "Sanford, FL",
] as const;

// Animation durations in milliseconds
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;
