import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { memo } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { MarketplaceHeader } from "./components/MarketplaceHeader";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { HomePage } from "./pages/HomePage";
import { ProductSearchPage } from "./pages/ProductSearchPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { MyListingsPage } from "./pages/MyListingsPage";
import { AddEditProductPage } from "./pages/AddEditProductPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PublicProfilePage } from "./pages/PublicProfilePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Memoize background decorations to prevent unnecessary re-renders
const BackgroundDecorations = memo(() => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.05,
    overflow: 'hidden',
  }}>
        {/* Circuit board patterns */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#285570" />
              <circle cx="190" cy="190" r="2" fill="#285570" />
              <circle cx="100" cy="50" r="2" fill="#285570" />
              <circle cx="50" cy="150" r="2" fill="#285570" />
              <line x1="10" y1="10" x2="100" y2="50" stroke="#285570" strokeWidth="1" />
              <line x1="100" y1="50" x2="190" y2="190" stroke="#285570" strokeWidth="1" />
              <line x1="10" y1="10" x2="50" y2="150" stroke="#285570" strokeWidth="1" />
              <rect x="48" y="48" width="4" height="4" fill="#285570" />
              <rect x="98" y="148" width="4" height="4" fill="#285570" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
        
        {/* Floating tech icons - more coverage */}
        <div style={{ position: 'absolute', top: '5%', left: '5%', fontSize: '120px', color: '#285570', transform: 'rotate(-15deg)' }}>⚙</div>
        <div style={{ position: 'absolute', top: '8%', right: '8%', fontSize: '80px', color: '#3B9FBC', transform: 'rotate(25deg)' }}>⚡</div>
        <div style={{ position: 'absolute', bottom: '8%', left: '10%', fontSize: '100px', color: '#285570', transform: 'rotate(10deg)' }}>◈</div>
        <div style={{ position: 'absolute', top: '45%', right: '15%', fontSize: '90px', color: '#3B9FBC', transform: 'rotate(-20deg)' }}>◉</div>
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', fontSize: '110px', color: '#285570', transform: 'rotate(35deg)' }}>✦</div>
        <div style={{ position: 'absolute', top: '35%', left: '3%', fontSize: '70px', color: '#3B9FBC', transform: 'rotate(-10deg)' }}>◆</div>
        <div style={{ position: 'absolute', bottom: '35%', left: '15%', fontSize: '85px', color: '#285570', transform: 'rotate(15deg)' }}>◇</div>
        <div style={{ position: 'absolute', top: '70%', right: '20%', fontSize: '95px', color: '#3B9FBC', transform: 'rotate(-25deg)' }}>✧</div>
        <div style={{ position: 'absolute', top: '25%', left: '45%', fontSize: '105px', color: '#285570', transform: 'rotate(20deg)' }}>◈</div>
        <div style={{ position: 'absolute', top: '55%', right: '40%', fontSize: '75px', color: '#3B9FBC', transform: 'rotate(-30deg)' }}>⚙</div>
        <div style={{ position: 'absolute', bottom: '45%', right: '8%', fontSize: '88px', color: '#285570', transform: 'rotate(12deg)' }}>✦</div>
        <div style={{ position: 'absolute', top: '15%', left: '25%', fontSize: '92px', color: '#3B9FBC', transform: 'rotate(-18deg)' }}>◉</div>
        
        {/* Binary code strings - more coverage */}
        <div style={{ position: 'absolute', top: '5%', left: '30%', fontSize: '14px', color: '#285570', fontFamily: 'monospace', letterSpacing: '2px' }}>
          01001001 01001111 01010100
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '30%', fontSize: '14px', color: '#3B9FBC', fontFamily: 'monospace', letterSpacing: '2px' }}>
          01000011 01001111 01000100 01000101
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '35%', fontSize: '14px', color: '#285570', fontFamily: 'monospace', letterSpacing: '2px' }}>
          01010100 01000101 01000011 01001000
        </div>
        <div style={{ position: 'absolute', top: '30%', right: '15%', fontSize: '14px', color: '#3B9FBC', fontFamily: 'monospace', letterSpacing: '2px' }}>
          01000100 01000001 01010100 01000001
        </div>
        <div style={{ position: 'absolute', bottom: '30%', left: '25%', fontSize: '14px', color: '#285570', fontFamily: 'monospace', letterSpacing: '2px' }}>
          01000010 01001001 01010100 01010011
        </div>
      </div>
));

BackgroundDecorations.displayName = 'BackgroundDecorations';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F5F0', position: 'relative' }}>
      <BackgroundDecorations />
      
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <MarketplaceHeader />
        {isAuthenticated ? (
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes - no layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Main app routes - with layout */}
      <Route
        path="/"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/search"
        element={
          <AppLayout>
            <ProductSearchPage />
          </AppLayout>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <AppLayout>
            <ProductDetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <OrdersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-listings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyListingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddEditProductPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:productId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddEditProductPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/:userId"
        element={
          <AppLayout>
            <PublicProfilePage />
          </AppLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
