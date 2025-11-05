import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks";
import { StatCard } from "../components/StatCard";

export function ProfilePage() {
  const { user } = useAuth();
  const { products } = useData();
  const navigate = useNavigate();
  const [showBannerInput, setShowBannerInput] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");

  if (!user) {
    return (
      <main className="container-page" style={{ backgroundColor: '#F8F5F0' }}>
        <div className="container-centered text-center" style={{ padding: '48px 0' }}>
          <h2 className="text-heading-secondary">Please Sign In</h2>
          <p className="text-muted">You need to sign in to view your profile</p>
        </div>
      </main>
    );
  }

  // Persist banner image per user
  const [bannerImage, setBannerImage] = useLocalStorage(`banner_${user.id}`, "");

  const handleBannerSave = () => {
    if (bannerUrl.trim()) {
      setBannerImage(bannerUrl.trim());
      setBannerUrl("");
      setShowBannerInput(false);
    }
  };

  // Calculate user statistics
  const myListings = products.filter((p) => p.sellerId === user.id);
  const activeListings = myListings.filter((p) => p.status === "active");

  const memberSince = new Date(user.id.split('_')[1] ? parseInt(user.id.split('_')[1]) : Date.now());

  return (
    <main className="container-page" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="container-centered">
        {/* Profile Header */}
        <div
          className={`profile-banner ${!bannerImage ? 'profile-banner-gradient' : ''}`}
          style={bannerImage ? {
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bannerImage}) center/cover`
          } : undefined}
        >
          {!bannerImage && (
            <div className="profile-banner-decoration" />
          )}
          
          {/* Change Banner Button */}
          <button
            onClick={() => setShowBannerInput(!showBannerInput)}
            className="profile-banner-button"
          >
            Change Banner
          </button>

          {showBannerInput && (
            <div className="profile-banner-input-panel">
              <input
                type="text"
                placeholder="Enter banner image URL"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #E8E7E5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBannerSave();
                  }
                }}
              />
              <Button
                onClick={handleBannerSave}
                className="w-full"
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#285570',
                  color: 'white',
                }}
              >
                Save Banner
              </Button>
            </div>
          )}

          <div className="flex-center gap-lg" style={{ justifyContent: 'flex-start', position: 'relative', zIndex: 1 }}>
            <Avatar className="profile-avatar-large">
              {user.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user.name} style={{ objectFit: 'cover' }} />
              ) : null}
              <AvatarFallback style={{ backgroundColor: '#D9EAF0', color: '#1C3D51', fontSize: '36px', fontWeight: '600' }}>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div style={{ flex: 1 }}>
              <h1 className="profile-name">
                {user.name}
              </h1>
              <div className="profile-member-info">
                <Calendar style={{ width: '16px', height: '16px' }} />
                <span>
                  Member since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <StatCard
            icon={<Package className="w-8 h-8" />}
            value={activeListings.length}
            label="Active Listings"
          />
          <StatCard
            icon={<Package className="w-8 h-8" />}
            value={myListings.length}
            label="Total Listings"
          />
        </div>

        {/* Current Listings */}
        {activeListings.length > 0 ? (
          <div>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2 className="profile-name" style={{ color: '#1C3D51', fontSize: '28px' }}>
                Current Listings
              </h2>
              <button
                onClick={() => navigate('/my-listings')}
                className="primary-button"
                style={{ padding: '10px 20px' }}
              >
                Manage All Listings
              </button>
            </div>
            <div className="profile-product-grid">
              {activeListings.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="profile-product-card"
                >
                  <div className="image-container">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className="image-absolute"
                    />
                    <Badge
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#1C3D51',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {product.condition}
                    </Badge>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 className="truncate-1" style={{ fontSize: '16px', fontWeight: '600', color: '#1C3D51', marginBottom: '8px' }}>
                      {product.title}
                    </h3>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#285570', marginBottom: '8px' }}>
                      {product.price}
                    </p>
                    <p className="text-tiny text-muted truncate-1">
                      {product.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card className="profile-empty-state">
            <Package style={{ width: '64px', height: '64px', color: '#CBCAC7', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1C3D51', marginBottom: '8px' }}>
              No Active Listings
            </h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              You don't have any active listings yet. Create your first listing to get started!
            </p>
            <button
              onClick={() => navigate('/sell')}
              className="primary-button"
            >
              Create New Listing
            </button>
          </Card>
        )}
      </div>
    </main>
  );
}
