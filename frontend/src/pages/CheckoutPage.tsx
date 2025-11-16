import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { paymentApi } from "../services/api";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const order = orders.find((o) => o.id === orderId && o.status === "CURRENT");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!order) {
    return (
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="mb-2">Order Not Found</h2>
          <p className="text-black mb-4">This order doesn't exist or has already been completed.</p>
          <Button onClick={() => navigate("/orders")}>View Orders</Button>
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!orderId) return;

    try {
      setIsProcessing(true);
      const { url } = await paymentApi.createCheckoutSession(orderId);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to create checkout session");
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/orders")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        
        <h2 className="text-heading-secondary mb-6 text-center" style={{ color: '#1C3D51', fontWeight: '700', fontFamily: '"Architects Daughter", cursive' }}>
          Checkout
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="pb-4 border-b">
                <CardTitle>Order Summary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Order ID: {order.id}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div 
                      key={item.product} 
                      className="flex gap-4"
                    >
                      {item.imageUrl && (
                        <div className="checkout-item-image-container">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                          />
                        </div>
                      )}
                      <div className="flex-1" style={{ minWidth: 0 }}>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="font-bold text-xl text-[#285570]">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader className="pb-4 border-b">
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Order breakdown */}
                <div className="space-y-2 pb-3 mb-3">
                  {order.items.map((item) => (
                    <div key={item.product} className="flex justify-between text-gray-700">
                      <span className="font-medium">{item.title}</span>
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-gray-600 text-sm pt-1">
                    <span>Shipping:</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax:</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">Order Total:</span>
                    <span className="text-xl font-bold text-[#285570]">${order.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment button */}
                <div className="mt-4 pt-4 border-t space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full text-white font-semibold"
                    style={{ backgroundColor: '#285570' }}
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay with Stripe"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    🔒 Secure payment powered by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
