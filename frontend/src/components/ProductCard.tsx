import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { COLORS, SHADOWS, CARD_STYLES } from "../constants";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  condition?: string;
  onClick?: () => void;
}

export function ProductCard({
  title,
  price,
  location,
  image,
  condition,
  onClick,
}: ProductCardProps) {
  return (
    <Card
      className="product-card-animate"
      style={{ 
        ...CARD_STYLES,
        borderColor: COLORS.GRAY_LIGHTER,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = SHADOWS.LG;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = SHADOWS.SM;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', backgroundColor: '#F5F3F1' }}>
        <ImageWithFallback
          src={image}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s'
          }}
        />
        {condition && (
          <div 
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(211, 234, 241, 0.9)',
              color: COLORS.PRIMARY,
              border: `1px solid ${COLORS.PRIMARY_LIGHTEST}`
            }}
          >
            {condition}
          </div>
        )}
      </div>
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: COLORS.SURFACE }}>
        <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: COLORS.PRIMARY }}>{price}</p>
        <p style={{
          fontSize: '14px',
          color: COLORS.CHARCOAL,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '8px',
          flex: 1
        }}>{title}</p>
        <p style={{ fontSize: '12px', color: COLORS.GRAY_DARK }}>{location}</p>
      </div>
    </Card>
  );
}
