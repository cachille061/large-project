import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Order } from "../contexts/DataContext";
import { formatPrice } from "../utils/formatPrice";

interface OrderCardProps {
  order: Order;
  onViewProduct: (productId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onCheckoutOrder?: (orderId: string) => void;
  showActions?: boolean;
}

export function OrderCard({ 
  order, 
  onViewProduct, 
  onCancelOrder,
  onCheckoutOrder,
  showActions = false 
}: OrderCardProps) {
  // Map order status to badge variant
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return "default";
      case "CURRENT":
        return "secondary";
      case "CANCELED":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CURRENT":
        return "Pending";
      case "FULFILLED":
        return "Completed";
      case "CANCELED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Payment Pending";
      case "PAID":
        return "Paid";
      case "REFUNDED":
        return "Refunded";
      default:
        return status;
    }
  };

  return (
    <Card className="card-shadow bg-white hover:bg-gray-50 transition-colors">
      <CardContent className="p-6">
        {/* Order header with status and date */}
        <div className="flex items-start justify-between mb-4 pb-6 border-b">
          <div>
            <p className="text-base text-black mb-1">Order ID: {order.id}</p>
            <p className="text-base text-black">
              Ordered: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getBadgeVariant(order.status)} className="text-sm px-3 py-1">
              {getStatusLabel(order.status)}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {getPaymentStatusLabel(order.paymentStatus)}
            </Badge>
          </div>
        </div>

        {/* Order items */}
        <div className="space-y-4 mb-4 pb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <ImageWithFallback
                src={item.imageUrl || ""}
                alt={item.title}
                className="w-16 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1 truncate">{item.title}</h4>
                <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</p>
                <p className="text-xs text-gray-500 mt-1">Product ID: {item.product}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total items and Subtotal */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-black">
            <span>Total items:</span>
            <span className="font-medium">{order.items.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Subtotal:</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(order.subtotal)}</span>
          </div>
        </div>

        {/* Action buttons */}
        {showActions && order.status === "CURRENT" && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {onCheckoutOrder && (
              <Button
                className="flex-1"
                onClick={() => onCheckoutOrder(order.id)}
              >
                Checkout
              </Button>
            )}
            {onCancelOrder && (
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => onCancelOrder(order.id)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
