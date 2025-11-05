import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MapPin, ArrowLeft, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";
import { SellerInfo } from "../components/SellerInfo";
import { ProductDetails } from "../components/ProductDetails";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { products, createOrder } = useData();
  const navigate = useNavigate();
  const [purchasing, setPurchasing] = useState(false);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <main className="container-page">
        <div className="container-centered text-center" style={{ padding: '48px 0' }}>
          <h2 className="text-heading-secondary">Product not found</h2>
          <Button onClick={() => navigate("/")}>Back to home</Button>
        </div>
      </main>
    );
  }

  const isSeller = user?.id === product.sellerId;
  const canPurchase = isAuthenticated && !isSeller && product.status === "active";

  const handlePurchase = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPurchasing(true);
    const success = createOrder(product.id, user.id, user.name, user.email);

    if (success) {
      toast.success("Order placed successfully!");
      navigate("/orders");
    } else {
      toast.error("Failed to place order. Product may no longer be available.");
    }
    setPurchasing(false);
  };

  const handleEdit = () => {
    navigate(`/edit/${product.id}`);
  };

  return (
    <main className="container-page">
      <div className="container-centered">
        <Button
          variant="ghost"
          style={{ marginBottom: '16px' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Back
        </Button>

        <div className="grid-cols-2">
          {/* Image */}
          <div className="image-bg-dark">
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '500px', objectFit: 'contain' }}
            />
          </div>

          {/* Details */}
          <div className="card-base" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              {product.status !== "active" && (
                <Badge variant="secondary" style={{ marginBottom: '8px' }}>
                  {product.status === "sold" ? "Sold" : "Delisted"}
                </Badge>
              )}
              <h1 style={{ marginBottom: '8px', fontSize: '32px', fontWeight: '700', color: '#1C3D51' }}>{product.price}</h1>
              <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: '600', color: '#333333' }}>{product.title}</h2>
            </div>

            <div className="flex-center gap-sm text-muted text-sm" style={{ justifyContent: 'flex-start', marginBottom: '24px' }}>
              <MapPin style={{ width: '16px', height: '16px' }} />
              {product.location}
            </div>

            {/* Action Buttons */}
            {isSeller ? (
              <div style={{ marginBottom: '24px' }}>
                <Alert style={{ marginBottom: '16px' }}>
                  <AlertDescription>
                    This is your listing
                  </AlertDescription>
                </Alert>
                <Button onClick={handleEdit} style={{ width: '100%' }}>
                  Edit Listing
                </Button>
              </div>
            ) : canPurchase ? (
              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                style={{ width: '100%', marginBottom: '24px', backgroundColor: '#285570', color: 'white' }}
              >
                <ShoppingCart style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                {purchasing ? "Processing..." : "Buy Now"}
              </Button>
            ) : !isAuthenticated ? (
              <Button
                onClick={() => navigate("/login")}
                style={{ width: '100%', marginBottom: '24px', backgroundColor: '#285570', color: 'white' }}
              >
                Sign in to purchase
              </Button>
            ) : (
              <Alert style={{ marginBottom: '24px' }}>
                <AlertDescription>
                  This product is no longer available
                </AlertDescription>
              </Alert>
            )}

            {/* Seller Info */}
            <SellerInfo sellerId={product.sellerId} sellerName={product.sellerName} />

            {/* Details */}
            <ProductDetails
              condition={product.condition}
              category={product.category}
              postedDate={new Date(product.createdAt).toLocaleDateString()}
            />

            {/* Description */}
            <div>
              <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#1C3D51' }}>Description</h3>
              <p className="text-sm text-muted" style={{ lineHeight: '1.6' }}>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

