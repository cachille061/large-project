import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshOrders } = useData();
  const { isAuthenticated } = useAuth();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Refresh orders to get the updated fulfilled order
    if (isAuthenticated) {
      refreshOrders();
    }
  }, [refreshOrders, isAuthenticated]);

  return (
    <main className="flex-1 p-6">
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl" style={{ fontFamily: '"Architects Daughter", cursive', color: '#1C3D51' }}>
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">Thank you for your purchase!</p>
            <p className="text-muted-foreground">
              Your order has been confirmed and the seller will be notified.
            </p>
            {sessionId && (
              <p className="text-sm text-muted-foreground">
                Session ID: {sessionId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                onClick={() => navigate("/orders")}
                className="bg-[#285570] hover:bg-[#1e3f54] text-white w-full sm:w-auto"
              >
                View My Orders
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
