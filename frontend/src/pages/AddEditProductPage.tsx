import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from "../constants";

export function AddEditProductPage() {
  const { productId } = useParams<{ productId?: string }>();
  const { user } = useAuth();
  const { products, addProduct, updateProduct } = useData();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Orlando, FL");
  const [category, setCategory] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const product = products.find((p) => p.id === productId);
      if (product && product.sellerId === user?.id) {
        setTitle(product.title);
        setPrice(product.price);
        setLocation(product.location);
        setCategory(product.category);
        setCondition(product.condition);
        setDescription(product.description);
        setImageUrl(product.image);
      } else {
        navigate("/my-listings");
      }
    }
  }, [isEdit, productId, products, user, navigate]);

  if (!user) {
    return (
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="mb-2">Please Sign In</h2>
          <p className="text-black mb-4">You need to sign in to list products</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Comprehensive validation
    if (!title || title.trim().length < 3 || title.length > 100) {
      toast.error("Title must be between 3 and 100 characters");
      setLoading(false);
      return;
    }

    if (!description || description.trim().length < 10 || description.length > 2000) {
      toast.error("Description must be between 10 and 2000 characters");
      setLoading(false);
      return;
    }

    if (!price) {
      toast.error("Please enter a price");
      setLoading(false);
      return;
    }

    // Parse price to number, removing $ if present
    const numericPrice = parseFloat(price.replace(/[$,]/g, ''));
    
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error("Please enter a valid positive price");
      setLoading(false);
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }

    if (!condition) {
      toast.error("Please select a condition");
      setLoading(false);
      return;
    }

    // Require image URL
    if (!imageUrl || !imageUrl.trim()) {
      toast.error("Please provide an image URL for your listing");
      setLoading(false);
      return;
    }

    // Validate image URL
    try {
      new URL(imageUrl);
    } catch {
      toast.error("Please enter a valid image URL");
      setLoading(false);
      return;
    }

    const productData = {
      title: title.trim(),
      price: numericPrice,
      location: location.trim(),
      category: category as any,
      condition: condition as any,
      description: description.trim(),
      images: [imageUrl.trim()],
    };

    try {
      if (isEdit) {
        await updateProduct(productId!, productData);
        toast.success("Product updated successfully");
      } else {
        await addProduct(productData);
        toast.success("Product listed successfully");
      }
      navigate("/my-listings");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save product");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/my-listings")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to my listings
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle style={{ fontSize: '32px', fontWeight: '700', color: '#1C3D51', fontFamily: '"Architects Daughter", cursive' }}>
              {isEdit ? "Edit Listing" : "Create New Listing"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    if (title && (title.length < 3 || title.length > 100)) {
                      toast.error("Title must be between 3 and 100 characters");
                    }
                  }}
                  placeholder="e.g., Gaming Keyboard RGB Mechanical"
                  required
                  minLength={3}
                  maxLength={100}
                  className="shadow-sm"
                />
                {title && title.length > 0 && (
                  <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => {
                    const numericPrice = parseFloat(price.replace(/[$,]/g, ''));
                    if (price && (isNaN(numericPrice) || numericPrice < 0)) {
                      toast.error("Please enter a valid positive price");
                    }
                  }}
                  placeholder="e.g., 85 or $85"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Orlando, FL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CONDITIONS.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => {
                    if (description && (description.length < 10 || description.length > 2000)) {
                      toast.error("Description must be between 10 and 2000 characters");
                    }
                  }}
                  placeholder="Describe your product in detail..."
                  rows={5}
                  required
                  minLength={10}
                  maxLength={2000}
                />
                {description && description.length > 0 && (
                  <p className={`text-xs ${description.length < 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {description.length}/2000 characters {description.length < 10 ? `(minimum 10)` : ''}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Product Image URL *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onBlur={() => {
                    if (imageUrl && imageUrl.trim()) {
                      try {
                        new URL(imageUrl);
                      } catch {
                        toast.error("Please enter a valid URL starting with http:// or https://");
                      }
                    }
                  }}
                  placeholder="https://example.com/product-image.jpg"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : isEdit ? "Update" : "List Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/my-listings")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

