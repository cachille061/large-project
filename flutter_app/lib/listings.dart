import 'package:flutter/material.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/add_product_page.dart';

class MyListingsPage extends StatefulWidget {
  const MyListingsPage({super.key});

  @override
  State<MyListingsPage> createState() => _MyListingsPageState();
}

class _MyListingsPageState extends State<MyListingsPage> {
  String? productToDelete;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    void _addProductButton(BuildContext context) {
      Navigator.push(
        context,
        MaterialPageRoute<void>(
          builder: (BuildContext context) => AddProductPage(),
        ),
      );
    }

    // TODO: Replace mock data with your providers / Firebase / API
    final myProducts = <Map<String, dynamic>>[
      {
        "id": "1",
        "title": "Laptop",
        "price": "2100 AED",
        "status": "active",
        "description": "A great laptop",
        "image": null,
      },
      {
        "id": "2",
        "title": "Phone",
        "price": "500 AED",
        "status": "sold",
        "description": "Like new",
        "image": null,
      },
    ];

    final myOrders = <Map<String, dynamic>>[];
    final activeProducts = myProducts
        .where((p) => p["status"] == "active")
        .toList();
    final soldProducts = myProducts
        .where((p) => p["status"] == "sold")
        .toList();

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        title: const Text("My Listings"),
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
                    Text("My Listings", style: TextStyle(fontSize: 24)),
                    SizedBox(height: 4),
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
                    _addProductButton(context);
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
                        Tab(text: "My Products"),
                        Tab(text: "Sales"),
                      ],
                    ),
                    Expanded(
                      child: TabBarView(
                        children: [
                          _buildProductsTab(context, myProducts),
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

  Widget _buildProductsTab(
    BuildContext context,
    List<Map<String, dynamic>> products,
  ) {
    if (products.isEmpty) {
      return const Center(child: Text("You haven't listed any products yet"));
    }

    final colors = Theme.of(context).colorScheme;

    return ListView.builder(
      itemCount: products.length,
      itemBuilder: (context, i) {
        final product = products[i];

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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product["title"],
                            style: const TextStyle(fontSize: 18),
                          ),
                          Text(
                            product["price"],
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
                      Spacer(),
                      Column(
                        children: [
                          SizedBox(
                            width: 100,
                            height: 30,
                            child: OutlinedButton(
                              onPressed: () {},
                              child: const Text("Edit"),
                            ),
                          ),
                          const SizedBox(height: 8),
                          SizedBox(
                            width: 100,
                            height: 30,
                            child: OutlinedButton(
                              onPressed: () {},
                              child: Text(
                                product["status"] == "active"
                                    ? "Delist"
                                    : "List",
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          SizedBox(
                            width: 100,
                            height: 30,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: colors.errorContainer,
                              ),
                              onPressed: () {
                                setState(() => productToDelete = product["id"]);
                              },
                              child: Text(
                                "Delete",
                                style: TextStyle(
                                  color: colors.onErrorContainer,
                                ),
                              ),
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
