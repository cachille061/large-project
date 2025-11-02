import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Order } from "../contexts/DataContext";

interface OrderCardProps {
  order: Order;
  onViewProduct: (productId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  showCancelButton?: boolean;
}

export function OrderCard({ 
  order, 
  onViewProduct, 
  onCancelOrder,
  showCancelButton = false 
}: OrderCardProps) {
  // Map order status to badge variant
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="card-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product image */}
          <ImageWithFallback
            src={order.productImage}
            alt={order.productTitle}
            className="w-24 h-24 object-cover rounded"
          />
          
          <div className="flex-1">
            {/* Order header with title, price, and status */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="mb-1">{order.productTitle}</h3>
                <p className="text-gray-600">{order.productPrice}</p>
              </div>
              <Badge variant={getBadgeVariant(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            
            {/* Order details */}
            <div className="text-sm text-gray-600 mb-3">
              <p>Seller: {order.sellerName}</p>
              <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Order ID: {order.id}</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewProduct(order.productId)}
              >
                View Product
              </Button>
              {showCancelButton && order.status === "pending" && onCancelOrder && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onCancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
