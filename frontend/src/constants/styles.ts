import { CSSProperties } from "react";
import { COLORS, SHADOWS } from "./theme";

// Card styles (used in ProductCard)
export const CARD_STYLES: CSSProperties = {
  borderRadius: "12px",
  backgroundColor: COLORS.SURFACE,
  boxShadow: SHADOWS.SM,
  transition: "all 0.3s",
};
