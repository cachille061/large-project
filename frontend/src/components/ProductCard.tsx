import { Badge } from "./ui/badge";
import { memo } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  location: string;
  image: string;
  condition?: string;
  onClick?: () => void;
}

export const ProductCard = memo(function ProductCard({
  title,
  price,
  originalPrice,
  location,
  image,
  condition,
  onClick,
}: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} - ${price} in ${location}`}
      className="profile-product-card"
    >
      <div className="image-container">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="image-absolute"
        />
      </div>
      <div style={{ padding: '16px', position: 'relative' }}>
        <h3 className="truncate-1" style={{ fontSize: '16px', fontWeight: '600', color: '#1C3D51', marginBottom: '8px' }}>
          {title}
        </h3>
        <div style={{ marginBottom: '8px' }}>
          {originalPrice && originalPrice !== price ? (
            <div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#66655F', textDecoration: 'line-through', marginRight: '8px' }}>
                {originalPrice}
              </span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#285570' }}>
                {price}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#285570', margin: 0 }}>
              {price}
            </p>
          )}
        </div>
        <p className="text-tiny text-muted truncate-1">
          {location}
        </p>
        {condition && (
          <Badge
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: '#285570',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
            }}
          >
            {condition}
          </Badge>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
