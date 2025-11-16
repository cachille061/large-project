import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { XCircle } from "lucide-react";

export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-orange-600" />
            </div>
            <CardTitle className="text-2xl" style={{ fontFamily: '"Architects Daughter", cursive', color: '#1C3D51' }}>
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">Your payment was not completed.</p>
            <p className="text-muted-foreground">
              No charges were made to your account. Your order is still in your cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                onClick={() => navigate("/orders")}
                className="bg-[#285570] hover:bg-[#1e3f54] text-white w-full sm:w-auto"
              >
                Return to Cart
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
