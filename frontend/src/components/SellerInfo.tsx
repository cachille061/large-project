import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SellerInfoProps {
  sellerId: string;
  sellerName: string;
  sellerProfilePicture?: string;
  location?: string;
}

export function SellerInfo({ sellerId, sellerName, sellerProfilePicture, location }: SellerInfoProps) {
  const navigate = useNavigate();

  return (
    <div className="divider-y" style={{ marginBottom: '16px' }}>
      <h3 className="text-sm" style={{ marginBottom: '12px', fontWeight: '600', color: '#1C3D51' }}>
        Seller information
      </h3>
      <div 
        className="flex-center gap-md" 
        style={{ justifyContent: 'flex-start', cursor: 'pointer' }}
        onClick={() => navigate(`/seller/${sellerId}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.padding = '8px';
          e.currentTarget.style.margin = '-8px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.padding = '0';
          e.currentTarget.style.margin = '0';
        }}
      >
        <Avatar>
          {sellerProfilePicture ? (
            <AvatarImage src={sellerProfilePicture} alt={sellerName} style={{ objectFit: 'cover' }} />
          ) : null}
          <AvatarFallback>
            {sellerName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p style={{ fontWeight: '500', color: '#1C3D51' }}>{sellerName}</p>
          <p className="text-tiny text-black">{location}</p>
        </div>
      </div>
    </div>
  );
}
