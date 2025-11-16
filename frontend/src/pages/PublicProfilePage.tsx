import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Package, Calendar, ArrowLeft } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { ProductCard } from "../components/ProductCard";

export function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { getProductsBySeller } = useData();
  const navigate = useNavigate();

  // Find seller by checking products
  const sellerProducts = getProductsBySeller(userId || "");
  const seller = sellerProducts.length > 0 
    ? { id: userId!, name: sellerProducts[0].sellerName, profilePicture: sellerProducts[0].sellerProfilePicture }
    : null;

  if (!seller) {
    return (
      <main className="container-page" style={{ backgroundColor: '#F8F5F0' }}>
        <div className="container-centered text-center" style={{ padding: '48px 0' }}>
          <h2 className="text-heading-secondary">Seller Not Found</h2>
          <p className="text-black">This seller profile doesn't exist</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </main>
    );
  }

  const activeListings = sellerProducts.filter((p) => p.status === "active");
  const soldProducts = sellerProducts.filter((p) => p.status === "sold");

  // Generate random banner color based on userId
  const bannerColors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  ];
  const bannerIndex = parseInt(userId?.split('_')[1] || "0") % bannerColors.length;
  const bannerGradient = bannerColors[bannerIndex];

  // Random member since date based on userId
  const daysAgo = (parseInt(userId?.split('_')[1] || "0") % 180) + 30;
  const memberSince = new Date(Date.now() - daysAgo * 86400000);

  return (
    <main className="container-page" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="container-centered">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <div
          className="profile-banner"
          style={{ background: bannerGradient }}
        >
          {/* Profile Info */}
          <div className="profile-info">
            <Avatar className="profile-avatar">
              {seller.profilePicture ? (
                <AvatarImage src={seller.profilePicture} alt={seller.name} style={{ objectFit: 'cover' }} />
              ) : null}
              <AvatarFallback className="profile-avatar-fallback">
                {seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="profile-name" style={{ fontFamily: '"Architects Daughter", cursive', fontWeight: '700' }}>{seller.name}</h1>
              <p className="profile-email">Community Member</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats-grid">
          <StatCard
            icon={<Package className="w-5 h-5" />}
            value={activeListings.length}
            label="Active Listings"
          />
          <StatCard
            icon={<Package className="w-5 h-5" />}
            value={soldProducts.length}
            label="Items Sold"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            value={memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            label="Member Since"
          />
        </div>

        {/* Active Listings Section */}
        <Card className="card-shadow" style={{ marginTop: '24px' }}>
          <CardContent style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700', color: '#1C3D51', fontFamily: '"Architects Daughter", cursive' }}>
              Active Listings ({activeListings.length})
            </h2>
            {activeListings.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-black">No active listings</p>
              </div>
            ) : (
              <div className="profile-product-grid">
                {activeListings.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    location={product.location}
                    image={product.image}
                    condition={product.condition}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
