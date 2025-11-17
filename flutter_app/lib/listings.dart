import 'package:flutter/material.dart';
import 'package:flutter_app/api_requests.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/add_product_page.dart';
import 'package:flutter_app/product_details.dart';

class MyListingsPage extends StatefulWidget {
  final String sellerId;
  const MyListingsPage({super.key, required this.sellerId});

  @override
  State<MyListingsPage> createState() => _MyListingsPageState();
}

class _MyListingsPageState extends State<MyListingsPage> with RouteAware {
  String? productToDelete;
  bool loading = false;
  bool loadingError = false;
  bool myPage = false;

  List<dynamic> myProducts = [];

  void getProducts() async {
    setState(() {
      loading = true;
      loadingError = false;
    });

    try {
      final fetchedProducts = await ApiRequests().getSellerProducts(
        widget.sellerId,
      );
      final myId = await ApiRequests().getMyId();
      setState(() {
        myProducts = fetchedProducts;
        loading = false;
        myPage = (myId == widget.sellerId);
      });
    } catch (error) {
      setState(() {
        loadingError = true;
        loading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    getProducts();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Subscribe to RouteObserver
    routeObserver.subscribe(this, ModalRoute.of(context)! as PageRoute);
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  void didPopNext() {
    // Called when returning to this page
    getProducts();
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    void addProductButton(BuildContext context) {
      Navigator.push(
        context,
        MaterialPageRoute<void>(
          builder: (BuildContext context) => AddEditProductPage(),
        ),
      );
    }

    final myOrders = <Map<String, dynamic>>[];
    final activeProducts = myProducts
        .where((p) => p["status"] == "available")
        .toList();
    final soldProducts = myProducts
        .where((p) => p["status"] == "sold")
        .toList();

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        title: const Text("Seller Info"),
        backgroundColor: colors.primaryContainer,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Seller Info", style: TextStyle(fontSize: 24)),
                    SizedBox(height: 4),
                    if (myPage)
                      Text(
                        "Manage your products and sales",
                        style: TextStyle(color: colors.onPrimaryContainer),
                      ),
                  ],
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.tertiaryContainer,
                  ),
                  onPressed: () {
                    addProductButton(context);
                  },
                  icon: Icon(Icons.add, color: colors.onTertiaryContainer),
                  label: Text(
                    "New Listing",
                    style: TextStyle(color: colors.onTertiaryContainer),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Stats Cards
            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2, // 2 per row (change to 4 for desktop)
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.8, // adjust card shape
              children: [
                _buildStatCard("Active Listings", activeProducts.length),
                _buildStatCard("Sold Products", soldProducts.length),
                _buildStatCard("Total Sales", myOrders.length),
                _buildStatCard(
                  "Pending Sales",
                  myOrders.where((o) => o["status"] == "pending").length,
                ),
              ],
            ),

            Expanded(
              child: DefaultTabController(
                length: 2,
                child: Column(
                  children: [
                    const TabBar(
                      tabs: [
                        Tab(text: "Listings"),
                        Tab(text: "Sales"),
                      ],
                    ),
                    Expanded(
                      child: TabBarView(
                        children: [
                          _buildProductsTab(context),
                          _buildSalesTab(myOrders),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavBar(),
    );
  }

  Widget _buildStatCard(String label, int value) {
    final colors = Theme.of(context).colorScheme;
    return Card(
      color: colors.secondaryContainer,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(color: colors.onSecondaryContainer)),
            const SizedBox(height: 8),
            Text(value.toString(), style: const TextStyle(fontSize: 24)),
          ],
        ),
      ),
    );
  }

  Widget _buildProductsTab(BuildContext context) {
    if (myProducts.isEmpty) {
      return const Center(child: Text("You haven't listed any myProducts yet"));
    }

    void editProductButton(BuildContext context, String id) {
      Navigator.push(
        context,
        MaterialPageRoute<void>(
          builder: (BuildContext context) =>
              AddEditProductPage(edit: true, id: id),
        ),
      );
    }

    void deleteProduct(id) async {
      setState(() {
        loading = true;
        loadingError = false;
      });
      final api = ApiRequests();
      await api.deleteProduct(id);
      final updated = await api.getSellerProducts(widget.sellerId);

      try {
        final fetchedProducts = await ApiRequests().getSellerProducts(
          widget.sellerId,
        );
        setState(() {
          myProducts = fetchedProducts;
          loading = false;
          myProducts = List.from(updated);
        });
      } catch (error) {
        debugPrint(error.toString());
        setState(() {
          loadingError = true;
          loading = false;
        });
      }
    }

    void _clickProduct(String id) {
      Navigator.push(
        context,
        MaterialPageRoute<void>(
          builder: (BuildContext context) => ProductDetailPage(productId: id),
        ),
      );
    }

    final colors = Theme.of(context).colorScheme;

    return ListView.builder(
      itemCount: myProducts.length,
      itemBuilder: (context, i) {
        final product = myProducts[i];

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: colors.secondaryContainer,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.image, size: 40),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Row(
                    children: [
                      Container(
                        width: 130,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product["title"],
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 18),
                            ),
                            Text(
                              "\$${product["price"].toString()}",
                              style: TextStyle(
                                color: colors.onSecondaryContainer,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              product["description"],
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: colors.onSecondaryContainer,
                              ),
                            ),
                            const SizedBox(height: 10),
                          ],
                        ),
                      ),
                      Spacer(),
                      Column(
                        children: [
                          if (myPage)
                            SizedBox(
                              width: 100,
                              height: 30,
                              child: OutlinedButton(
                                onPressed: () {
                                  editProductButton(context, product["_id"]);
                                },
                                child: const Text("Edit"),
                              ),
                            ),
                          if (myPage) const SizedBox(height: 8),
                          if (myPage)
                            SizedBox(
                              width: 100,
                              height: 30,
                              child: OutlinedButton(
                                onPressed: () {},
                                child: Text(
                                  product["status"] == "available"
                                      ? "Delist"
                                      : "List",
                                ),
                              ),
                            ),
                          if (myPage) const SizedBox(height: 8),
                          if (myPage)
                            SizedBox(
                              width: 100,
                              height: 30,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: colors.errorContainer,
                                ),
                                onPressed: () => deleteProduct(product["_id"]),
                                child: Text(
                                  "Delete",
                                  style: TextStyle(
                                    color: colors.onErrorContainer,
                                  ),
                                ),
                              ),
                            ),
                          if (!myPage)
                            SizedBox(
                              width: 100,
                              height: 30,
                              child: OutlinedButton(
                                onPressed: () => _clickProduct(product["_id"]),
                                child: Text("Details"),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSalesTab(List<Map<String, dynamic>> orders) {
    if (orders.isEmpty) {
      return const Center(child: Text("No sales yet"));
    }

    final colors = Theme.of(context).colorScheme;

    return ListView.builder(
      itemCount: orders.length,
      itemBuilder: (context, i) {
        final order = orders[i];

        return ListTile(
          leading: Container(
            width: 50,
            height: 50,
            color: colors.secondaryContainer,
            child: const Icon(Icons.image),
          ),
          title: Text(order["productTitle"] ?? "Product"),
          subtitle: Text(order["buyerName"] ?? "Buyer"),
          trailing: Text(order["status"] ?? "status"),
        );
      },
    );
  }
}
