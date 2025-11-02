import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Home, ShoppingBag, Package, Plus, Laptop, Monitor, Cpu, Mouse, Keyboard, Tablet, Camera, Mic, Headphones, Smartphone, User } from "lucide-react";
import { Button } from "./ui/button";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/"
    },
    { 
      icon: ShoppingBag, 
      label: "My Orders", 
      path: "/orders"
    },
    { 
      icon: Package, 
      label: "My Listings", 
      path: "/my-listings"
    },
    { 
      icon: User, 
      label: "View Profile", 
      path: "/profile"
    },
  ];

  const categories = [
    { icon: Package, label: "All Categories", value: "all" },
    { icon: Laptop, label: "Laptops", value: "Laptops" },
    { icon: Monitor, label: "Monitors & Displays", value: "Monitors & Displays" },
    { icon: Cpu, label: "Computer Parts", value: "Computer Parts" },
    { icon: Mouse, label: "Accessories", value: "Accessories" },
    { icon: Keyboard, label: "Keyboards", value: "Keyboards" },
    { icon: Tablet, label: "Tablets", value: "Tablets" },
    { icon: Smartphone, label: "Gaming Consoles", value: "Gaming Consoles" },
    { icon: Camera, label: "Cameras", value: "Cameras" },
    { icon: Mic, label: "Audio", value: "Audio" },
    { icon: Headphones, label: "Streaming Equipment", value: "Streaming Equipment" },
    { icon: Monitor, label: "Desktops", value: "Desktops" },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const currentCategory = searchParams.get("category");
  const isCategoryActive = (categoryValue: string) => {
    if (categoryValue === "all") {
      return !currentCategory || currentCategory === "all";
    }
    return currentCategory === categoryValue;
  };

  const handleCategoryClick = (category: string) => {
    const currentQuery = searchParams.get("q");
    const params = new URLSearchParams();
    
    if (currentQuery) {
      params.set("q", currentQuery);
    }
    
    if (category !== "all") {
      params.set("category", category);
    }
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <aside
      style={{
        width: "280px",
        backgroundColor: "#F8F5F0",
        borderRight: "1px solid #E8E7E5",
        height: "calc(100vh - 56px)",
        position: "sticky",
        top: "56px",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.03)",
        zIndex: 20,
      }}
    >
      {/* Create New Listing Button */}
      <Button
        onClick={() => navigate("/sell")}
        style={{
          backgroundColor: "#285570",
          color: "white",
          padding: "14px 20px",
          marginBottom: "8px",
          fontSize: "15px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(40, 85, 112, 0.25)",
          transition: "all 0.3s ease",
          border: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1e3f54";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(40, 85, 112, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#285570";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(40, 85, 112, 0.25)";
        }}
      >
        <Plus style={{ width: "20px", height: "20px" }} />
        Create a new listing
      </Button>

      {/* Navigation Section */}
      <div style={{ marginBottom: "12px" }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#66655F",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px",
            paddingLeft: "12px",
            fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
          }}
        >
          Navigation
        </h3>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: active ? "#285570" : "transparent",
                color: active ? "white" : "#1C3D51",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: "4px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "#D3EAF1";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <Icon
                style={{
                  width: "20px",
                  height: "20px",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: active ? "600" : "500",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {item.label}
              </div>
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    backgroundColor: "#F8F5F0",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Categories Section */}
      <div style={{ marginBottom: "12px", overflowY: "auto", flex: 1 }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#66655F",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px",
            paddingLeft: "12px",
            fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
          }}
        >
          Categories
        </h3>

        {categories.map((category) => {
          const Icon = category.icon;
          const active = isCategoryActive(category.value);

          return (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: active ? "#285570" : "transparent",
                color: active ? "white" : "#1C3D51",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: "4px",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "#D3EAF1";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <Icon
                style={{
                  width: "18px",
                  height: "18px",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: active ? "600" : "500",
                  textAlign: "left",
                }}
              >
                {category.label}
              </div>
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    backgroundColor: "#F8F5F0",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
