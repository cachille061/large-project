import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingBag, Package, LogOut, Camera, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function MarketplaceHeader() {
  const { user, isAuthenticated, logout, updateProfilePicture } = useAuth();
  const { products } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchDropdown(true);
    setFocusedIndex(-1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    // Predefined tech-related keywords
    const techKeywords = [
      'laptop', 'computer', 'desktop', 'monitor', 'keyboard', 'mouse',
      'headphones', 'gaming', 'macbook', 'ipad', 'tablet', 'smartphone',
      'camera', 'microphone', 'webcam', 'graphics card', 'gpu', 'cpu',
      'processor', 'ram', 'memory', 'storage', 'ssd', 'hard drive',
      'wireless', 'bluetooth', 'usb', 'charger', 'cable', 'adapter',
      'speaker', 'audio', 'mechanical', 'rgb', 'streaming', 'gaming chair',
      'desk', 'accessories', 'tech', 'electronics', 'apple', 'dell',
      'hp', 'lenovo', 'asus', 'samsung', 'sony', 'logitech', 'razer',
      '4k', 'ultrawide', 'curved', 'oled', 'lcd', 'led'
    ];
    
    // Add matching tech keywords
    techKeywords.forEach((keyword) => {
      if (keyword.includes(query)) {
        suggestions.add(keyword);
      }
    });
    
    // Add matching categories from actual products
    products
      .filter((p) => p.status === "active")
      .forEach((p) => {
        if (p.category.toLowerCase().includes(query)) {
          suggestions.add(p.category);
        }
      });
    
    return Array.from(suggestions).slice(0, 6);
  }, [products, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchDropdown || searchSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < searchSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const suggestion = searchSuggestions[focusedIndex];
      setSearchQuery(suggestion);
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
      setShowSearchDropdown(false);
    } else if (e.key === "Escape") {
      setShowSearchDropdown(false);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#F8F5F0', borderBottom: '1px solid #E8E7E5', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div style={{ width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', height: '56px' }}>
          {/* Logo */}
          <div
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              flexShrink: 0,
              gap: '12px'
            }}
            onClick={() => navigate("/")}
          >
            <svg width="240" height="48" viewBox="0 0 240 48" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#285570', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#3B9FBC', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#5899B5', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Computer chip icon on the left */}
              <g transform="translate(6, 8)">
                <rect x="0" y="0" width="32" height="32" rx="6" fill="url(#logoGradient)" style={{ filter: 'url(#glow)' }}/>
                <rect x="2" y="2" width="28" height="28" rx="4" fill="rgba(255, 255, 255, 0.2)"/>
                
                {/* Chip details */}
                <rect x="10" y="10" width="12" height="12" rx="1" fill="#FFFFFF" opacity="0.9"/>
                <line x1="10" y1="14" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="22" y1="14" x2="32" y2="14" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="10" y1="18" x2="0" y2="18" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="22" y1="18" x2="32" y2="18" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="14" y1="10" x2="14" y2="0" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="18" y1="10" x2="18" y2="0" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="14" y1="22" x2="14" y2="32" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
                <line x1="18" y1="22" x2="18" y2="32" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
              </g>
              
              {/* Text with slight cursive style */}
              <text
                x="50"
                y="30"
                fontFamily="'Trebuchet MS', 'Lucida Sans', sans-serif"
                fontSize="28"
                fontWeight="600"
                fill="url(#logoGradient)"
                letterSpacing="0.8"
                fontStyle="italic"
              >
                COREMARKET
              </text>
              
              {/* Subtle underline accent */}
              <rect x="50" y="33" width="70" height="2.5" fill="#3B9FBC" opacity="0.4" rx="1.25"/>
            </svg>
          </div>

          {/* Search */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '576px', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6B6A66', pointerEvents: 'none', zIndex: 1 }} />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                style={{ paddingLeft: '40px', border: '1px solid #D6D4CF', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', backgroundColor: '#EBE8E3', borderColor: '#D6D4CF' }}
              />
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && searchQuery.trim() && searchSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #CBCAC7',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 100,
                }}
              >
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                      setShowSearchDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      backgroundColor: focusedIndex === index ? '#F8F5F0' : 'white',
                      borderBottom: index < searchSuggestions.length - 1 ? '1px solid #E8E7E5' : 'none',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <Search style={{ width: '16px', height: '16px', color: '#66655F', flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#1C3D51',
                        textTransform: 'capitalize',
                      }}
                    >
                      {suggestion}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    style={{ 
                      borderRadius: '9999px', 
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      padding: '2px',
                      marginRight: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(40, 85, 112, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <Avatar style={{ width: '40px', height: '40px' }}>
                      {user?.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={user.name} style={{ objectFit: 'cover' }} />
                      ) : null}
                      <AvatarFallback style={{ backgroundColor: '#D9EAF0', color: '#1C3D51', fontSize: '16px' }}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', minWidth: '240px' }}>
                  <DropdownMenuLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar style={{ width: '40px', height: '40px' }}>
                        {user?.profilePicture ? (
                          <AvatarImage src={user.profilePicture} alt={user.name} style={{ objectFit: 'cover' }} />
                        ) : null}
                        <AvatarFallback style={{ backgroundColor: '#D9EAF0', color: '#1C3D51' }}>
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user?.name}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowImageInput(!showImageInput);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Camera style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    Change Profile Picture
                  </DropdownMenuItem>
                  {showImageInput && (
                    <div style={{ padding: '8px 12px' }} onClick={(e) => e.stopPropagation()}>
                      <Input
                        type="text"
                        placeholder="Enter image URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && imageUrl.trim()) {
                            updateProfilePicture(imageUrl.trim());
                            setImageUrl("");
                            setShowImageInput(false);
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (imageUrl.trim()) {
                            updateProfilePicture(imageUrl.trim());
                            setImageUrl("");
                            setShowImageInput(false);
                          }
                        }}
                        style={{ 
                          width: '100%', 
                          fontSize: '12px', 
                          padding: '6px 12px',
                          backgroundColor: '#285570',
                          color: 'white'
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ShoppingBag style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-listings")}>
                    <Package style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/login")} style={{ borderColor: '#B3D5E0', color: '#234A61' }}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/signup")} style={{ backgroundColor: '#285570', color: 'white' }}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
