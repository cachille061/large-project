// Brand colors (used in ProductCard and styles.ts)
export const COLORS = {
  // Primary - Deep Teal
  PRIMARY: "#285570",
  PRIMARY_LIGHT: "#3B9FBC",
  PRIMARY_LIGHTER: "#5899B5",
  PRIMARY_LIGHTEST: "#8DC0D1",
  
  // Neutral - Gray scale
  CHARCOAL: "#333333",
  GRAY_DARK: "#66655F",
  GRAY: "#85847F",
  GRAY_LIGHT: "#CBCAC7",
  GRAY_LIGHTER: "#E8E7E5",
  
  // Background
  BACKGROUND: "#F8F5F0",
  BACKGROUND_ALT: "#FAF7F6",
  SURFACE: "#FFFFFF",
  SURFACE_ALT: "#E3DED7",
  MUTED: "#F5F3F1",
  
  // Status colors
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  INFO: "#3B82F6",
} as const;

// Shadow values (used in ProductCard and styles.ts)
export const SHADOWS = {
  SM: "0 2px 8px rgba(0, 0, 0, 0.08)",
  MD: "0 4px 12px rgba(0, 0, 0, 0.1)",
  LG: "0 8px 24px rgba(0, 0, 0, 0.12)",
  XL: "0 12px 32px rgba(0, 0, 0, 0.15)",
} as const;
