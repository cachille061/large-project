import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ShoppingBag, Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useOrderManagement } from "../hooks";
import { OrderCard } from "../components/OrderCard";
import { EmptyState } from "../components/EmptyState";

export function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByBuyer, cancelOrder } = useData();
  const navigate = useNavigate();
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="mb-2">Please Sign In</h2>
          <p className="text-black mb-4">You need to sign in to view your orders</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </main>
    );
  }

  const myOrders = getOrdersByBuyer(user!.id);
  
  // Categorize orders by status
  const { all: allOrders, pending: pendingOrders, completed: completedOrders, cancelled: cancelledOrders } = useOrderManagement(myOrders);

  const handleCancelOrder = () => {
    if (orderToCancel) {
      cancelOrder(orderToCancel);
      toast.success("Order cancelled");
      setOrderToCancel(null);
    }
  };

  const handleCheckoutOrder = (orderId: string) => {
    navigate(`/checkout/${orderId}`);
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-heading-secondary mb-6" style={{ color: '#1C3D51', fontWeight: '700', fontFamily: '"Architects Daughter", cursive' }}>
          My Orders
        </h2>

        {allOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-12 h-12" />}
            title="No orders yet"
            description="Start shopping to see your orders here"
            actionLabel="Browse products"
            onAction={() => navigate("/")}
          />
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                All Orders ({allOrders.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {allOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewProduct={(productId) => navigate(`/product/${productId}`)}
                    onCancelOrder={setOrderToCancel}
                    onCheckoutOrder={handleCheckoutOrder}
                    showActions={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {pendingOrders.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-12 h-12" />}
                  title="No pending orders"
                  description=""
                />
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {pendingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewProduct={(productId) => navigate(`/product/${productId}`)}
                      onCancelOrder={setOrderToCancel}
                      onCheckoutOrder={handleCheckoutOrder}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedOrders.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-12 h-12" />}
                  title="No completed orders"
                  description=""
                />
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {completedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewProduct={(productId) => navigate(`/product/${productId}`)}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {cancelledOrders.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-12 h-12" />}
                  title="No cancelled orders"
                  description=""
                />
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {cancelledOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewProduct={(productId) => navigate(`/product/${productId}`)}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <AlertDialog open={!!orderToCancel} onOpenChange={() => setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? The product will become available again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center sm:justify-center">
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>Cancel Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

