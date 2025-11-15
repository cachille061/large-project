import 'package:flutter/material.dart';
import 'package:flutter_app/add_product_page.dart';
import 'package:flutter_app/api_requests.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/sign_up_page.dart';

class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage({super.key, required this.productId});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  bool loading = true;
  bool purchasing = false;
  String? errorText;
  dynamic product;
  bool isSeller = false;
  bool isActive = false;
  DateTime? uploadDate;

  @override
  void initState() {
    super.initState();
    _fetchProduct();
  }

  Future<void> _fetchProduct() async {
    try {
      final fetchedProduct = (await ApiRequests().getProducts(
        id: widget.productId,
      ))[0];
      isSeller = await ApiRequests().isSeller(widget.productId);
      isActive = fetchedProduct["status"] == "available";

      setState(() {
        product = fetchedProduct;
        loading = false;
        uploadDate = DateTime.parse(product["createdAt"]);
      });
    } catch (e) {
      setState(() {
        errorText = 'Failed to load product';
        loading = false;
      });
    }
  }

  Future<void> handlePurchase() async {
    if (!ApiRequests.loggedIn) {
      Navigator.push(
        context,
        MaterialPageRoute<void>(
          builder: (BuildContext context) => SignUpPage(),
        ),
      );
      return;
    }
    setState(() {
      purchasing = true;
    });

    final success = await ApiRequests().buyProduct(product["_id"]);

    if (success) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Order placed!")));
      Navigator.pushNamed(context, '/orders');
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Failed to place order")));
    }

    setState(() {
      purchasing = false;
    });
  }

  void handleEdit() {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) =>
            AddEditProductPage(edit: true, id: product["_id"]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    if (loading) {
      return Scaffold(
        backgroundColor: colors.surface,
        appBar: AppBar(
          title: const Text("Product Details"),
          backgroundColor: colors.primaryContainer,
        ),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (errorText != null) {
      return Scaffold(
        backgroundColor: colors.surface,
        appBar: AppBar(
          title: const Text("Product Details"),
          backgroundColor: colors.primaryContainer,
        ),
        body: Center(child: Text(errorText!)),
      );
    }

    if (product == null) {
      return Scaffold(
        backgroundColor: colors.surface,
        appBar: AppBar(
          title: const Text("Product Details"),
          backgroundColor: colors.primaryContainer,
        ),
        body: Center(
          child: Text(
            "Product not found",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        title: const Text("Product Details"),
        backgroundColor: colors.primaryContainer,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Container(
              color: colors.surface,
              // child: Image.network(product["image, fit: BoxFit.contain),
            ),
            const SizedBox(height: 16),

            // Details
            Card(
              color: colors.secondaryContainer,
              margin: EdgeInsets.zero,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Badge + Price + Title
                    if (isActive)
                      Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(
                          vertical: 4,
                          horizontal: 8,
                        ),
                        decoration: BoxDecoration(
                          color: colors.surface,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          product["status"] == 'sold' ? 'Sold' : 'Delisted',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: colors.onSurface,
                          ),
                        ),
                      ),
                    Text(
                      "\$${product["price"]}",
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      product["title"],
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Location
                    Row(
                      children: [
                        const Icon(Icons.location_pin, size: 16),
                        const SizedBox(width: 4),
                        Text(product["location"]),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Action Buttons
                    if (isSeller) ...[
                      Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(8),
                        color: colors.primaryContainer,
                        child: const Text("This is your listing"),
                      ),
                      ElevatedButton(
                        onPressed: handleEdit,
                        child: Text(
                          "Edit Listing",
                          style: TextStyle(color: colors.onPrimaryContainer),
                        ),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                        ),
                      ),
                    ] else if (ApiRequests.loggedIn &&
                        !isSeller &&
                        isActive) ...[
                      ElevatedButton.icon(
                        onPressed: purchasing ? null : handlePurchase,
                        icon: const Icon(Icons.shopping_cart),
                        label: Text(
                          purchasing ? "Added to Cart!" : "Add to Cart",
                          style: TextStyle(color: colors.onTertiaryContainer),
                        ),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          backgroundColor: colors.tertiaryContainer,
                          iconColor: colors.onTertiaryContainer,
                        ),
                      ),
                    ] else if (ApiRequests.loggedIn) ...[
                      ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/login'),
                        child: const Text("Sign in to purchase"),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          backgroundColor: colors.tertiaryContainer,
                          iconColor: colors.onTertiaryContainer,
                        ),
                      ),
                    ] else ...[
                      Container(
                        margin: const EdgeInsets.only(bottom: 24),
                        padding: const EdgeInsets.all(8),
                        color: colors.errorContainer,
                        child: Text(
                          "This product is no longer available",
                          style: TextStyle(color: colors.onErrorContainer),
                        ),
                      ),
                    ],

                    const SizedBox(height: 16),

                    // Seller Info
                    Text("Seller Info"),
                    const SizedBox(height: 16),

                    // Product Details
                    Text("Product Details"),
                    const SizedBox(height: 16),

                    // Category
                    const Text(
                      "Category",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      product["category"],
                      style: const TextStyle(height: 1.6),
                    ),

                    const SizedBox(height: 16),

                    // Condition
                    const Text(
                      "Condition",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      VALID_TO_DISPLAY_CONDITION["condition"].toString(),
                      style: const TextStyle(height: 1.6),
                    ),

                    const SizedBox(height: 16),

                    // Posted Date
                    const Text(
                      "Posted Date",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "${uploadDate?.month}/${uploadDate?.day}/${uploadDate?.year}",

                      style: const TextStyle(height: 1.6),
                    ),

                    const SizedBox(height: 16),
                    // Description
                    const Text(
                      "Description",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      product["description"],
                      style: const TextStyle(height: 1.6),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
