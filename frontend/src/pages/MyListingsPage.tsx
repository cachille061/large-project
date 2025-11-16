import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Plus, Edit, Eye, EyeOff, Package } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
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
import { toast } from "sonner";

export function MyListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { products, orders, updateProduct, deleteProduct } = useData();
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="mb-2">Please Sign In</h2>
          <p className="text-black mb-4">You need to sign in to manage your listings</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </main>
    );
  }

  const myProducts = products.filter((p) => p.sellerId === user!.id);
  const myOrders = orders.filter((o) => o.items.some(item => item.sellerId === user!.id));

  const activeProducts = myProducts.filter((p) => p.status === "active");
  const soldProducts = myProducts.filter((p) => p.status === "sold");
  const delistedProducts = myProducts.filter((p) => p.status === "delisted");

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "delisted" : "active";
      await updateProduct(productId, { status: newStatus as any });
      toast.success(`Product ${newStatus === "active" ? "relisted" : "delisted"}`);
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      toast.success("Product deleted");
      setProductToDelete(null);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-heading-secondary" style={{ color: '#1C3D51', fontWeight: '700', fontFamily: '"Architects Daughter", cursive' }}>
              My Listings
            </h2>
          </div>
          <Button 
            onClick={() => navigate("/sell")} 
            className="gap-2 bg-[#285570] hover:bg-[#1e3f54] text-white"
          >
            <Plus className="w-4 h-4" />
            New Listing
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardDescription>Active Listings</CardDescription>
              <CardTitle className="text-3xl">{activeProducts.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardDescription>Delisted</CardDescription>
              <CardTitle className="text-3xl">{delistedProducts.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardDescription>Sold Products</CardDescription>
              <CardTitle className="text-3xl">{soldProducts.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsContent value="products" className="mt-6">
            {myProducts.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-black mb-4">You haven't listed any products yet</p>
                  <Button className="primary-button" onClick={() => navigate("/sell")}>Create your first listing</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myProducts
                  .sort((a, b) => {
                    const statusOrder = { active: 0, delisted: 1, sold: 2 };
                    return statusOrder[a.status] - statusOrder[b.status];
                  })
                  .map((product) => (
                  <Card key={product.id} className="shadow-md">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="listing-card-image-container">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.title}
                          />
                        </div>
                        <div className="flex-1" style={{ minWidth: 0 }}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="mb-1">{product.title}</h3>
                              <p className="text-black">{product.price}</p>
                            </div>
                            <Badge
                              variant={
                                product.status === "active"
                                  ? "default"
                                  : product.status === "sold"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-black mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex gap-2">
                            {product.status === "sold" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/product/${product.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/edit/${product.id}`)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(product.id, product.status)}
                                >
                                  {product.status === "active" ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-1" />
                                      Delist
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-1" />
                                      List
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setProductToDelete(product.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sales" className="mt-6">
            {myOrders.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="text-center py-12">
                  <p className="text-black">No sales yet</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', overflow: 'hidden', borderRadius: '6px', flexShrink: 0 }}>
                                <ImageWithFallback
                                  src={order.productImage}
                                  alt={order.productTitle}
                                />
                              </div>
                              <span>{order.productTitle}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{order.buyerName}</p>
                              <p className="text-xs text-black">{order.buyerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.productPrice}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

