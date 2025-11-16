import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { memo, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { MarketplaceHeader } from "./components/MarketplaceHeader";
import { Sidebar } from "./components/Sidebar";

// Eager load auth pages (needed immediately)
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

// Lazy load other pages
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const ProductSearchPage = lazy(() => import("./pages/ProductSearchPage").then(m => ({ default: m.ProductSearchPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const MyListingsPage = lazy(() => import("./pages/MyListingsPage").then(m => ({ default: m.MyListingsPage })));
const AddEditProductPage = lazy(() => import("./pages/AddEditProductPage").then(m => ({ default: m.AddEditProductPage })));
const OrdersPage = lazy(() => import("./pages/OrdersPage").then(m => ({ default: m.OrdersPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage").then(m => ({ default: m.PublicProfilePage })));
const FontGalleryPage = lazy(() => import("./pages/FontGalleryPage").then(m => ({ default: m.FontGalleryPage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage").then(m => ({ default: m.PaymentSuccessPage })));
const PaymentCancelPage = lazy(() => import("./pages/PaymentCancelPage").then(m => ({ default: m.PaymentCancelPage })));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '400px',
    color: '#285570' 
  }}>
    <div>Loading...</div>
  </div>
);

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
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: '8px 16px',
          backgroundColor: '#285570',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          top: '8px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '8px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
        }}
      >
        Skip to main content
      </a>
      <BackgroundDecorations />
      
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <MarketplaceHeader />
        {isAuthenticated ? (
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div id="main-content" style={{ flex: 1 }}>
              {children}
            </div>
          </div>
        ) : (
          <div id="main-content">
            {children}
          </div>
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
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/search"
        element={
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ProductSearchPage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/fonts"
        element={
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <FontGalleryPage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ProductDetailPage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LoadingFallback />}>
                <OrdersPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-listings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LoadingFallback />}>
                <MyListingsPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LoadingFallback />}>
                <AddEditProductPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:productId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LoadingFallback />}>
                <AddEditProductPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/:userId"
        element={
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <PublicProfilePage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/checkout/:orderId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LoadingFallback />}>
                <CheckoutPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/success"
        element={
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <PaymentSuccessPage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/payment/cancel"
        element={
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <PaymentCancelPage />
            </Suspense>
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
