import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/api_requests.dart';
import 'package:flutter_app/product_details.dart';
import 'package:flutter_app/stripe_order.dart';

class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key});

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  List<dynamic> allOrders = [];
  List<dynamic> pendingOrders = [];
  List<dynamic> completedOrders = [];
  List<dynamic> cancelledOrders = [];
  String orderId = "";
  bool showWebView = false;

  dynamic orderToCancel; // selected order

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    getOrders();
  }

  Future<void> getOrders() async {
    final (List, List, String) orders = await ApiRequests().getOrders();
    setState(() {
      pendingOrders = orders.$1;
      for (dynamic order in orders.$2) {
        if (order["status"] == "FULFILLED")
          completedOrders.add(order);
        else
          cancelledOrders.add(order);
      }
      orderId = orders.$3;
      allOrders = pendingOrders + completedOrders + cancelledOrders;
    });
  }

  void _homeButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
    );
  }

  void _clickProduct(String id) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => ProductDetailPage(productId: id),
      ),
    );
  }

  void _checkoutOrders() async {
    final url = await ApiRequests().getStripeURL(orderId);
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => CheckoutPage(url: url),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Orders"),
        backgroundColor: colors.primaryContainer,
      ),
      body: Column(
        children: [
          const SizedBox(height: 16),
          const Text(
            "My Orders",
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),

          const SizedBox(height: 16),

          allOrders.isEmpty
              ? _buildEmptyState(
                  icon: Icons.shopping_bag_outlined,
                  title: "No orders yet",
                  subtitle: "Start shopping to see your orders here",
                  actionLabel: "Browse products",
                  onAction: () {
                    _homeButton(context);
                  },
                )
              : Expanded(
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 150,
                            height: 50,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: colors.secondaryContainer,
                              ),
                              onPressed: () {
                                _checkoutOrders();
                              },
                              child: Text(
                                "Checkout Cart",
                                style: TextStyle(
                                  color: colors.onSecondaryContainer,
                                ),
                              ),
                            ),
                          ),
                          SizedBox(width: 10),
                          SizedBox(
                            width: 150,
                            height: 50,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: colors.errorContainer,
                              ),
                              onPressed: () => _showCancelDialog(orderId),
                              child: Text(
                                "Cancel Cart",
                                style: TextStyle(
                                  color: colors.onErrorContainer,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 32),
                      _buildTabs(),
                    ],
                  ),
                ),
        ],
      ),
      bottomNavigationBar: NavBar(),
    );
  }

  // -------------------------------------------
  // TABS SECTION
  // -------------------------------------------
  Widget _buildTabs() {
    return Expanded(
      child: Column(
        children: [
          TabBar(
            controller: _tabController,
            tabs: [
              Tab(text: "Cart (${pendingOrders.length})"),
              Tab(text: "Completed (${completedOrders.length})"),
              Tab(text: "Cancelled (${cancelledOrders.length})"),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildWithEmpty(
                  pendingOrders,
                  icon: Icons.inventory_2_outlined,
                  title: "No pending orders",
                  showCancel: true,
                ),
                _buildWithEmpty(
                  completedOrders,
                  icon: Icons.inventory_2_outlined,
                  title: "No completed orders",
                  showCancel: false,
                ),
                _buildWithEmpty(
                  cancelledOrders,
                  icon: Icons.inventory_2_outlined,
                  title: "No cancelled orders",
                  showCancel: false,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------
  // LIST + CARD SECTION
  // -------------------------------------------
  Widget _buildWithEmpty(
    List list, {
    required IconData icon,
    required String title,
    required bool showCancel,
  }) {
    if (list.isEmpty) {
      return Center(
        child: _buildEmptyState(icon: icon, title: title, subtitle: ""),
      );
    }

    return _buildOrderList(list, showCancel: showCancel);
  }

  Widget _buildOrderList(List orders, {required bool showCancel}) {
    final colors = Theme.of(context).colorScheme;
    return ListView.builder(
      itemCount: orders.length,
      itemBuilder: (context, i) {
        List items = orders[i]["items"];
        return ListView.builder(
          shrinkWrap: true,
          physics: ClampingScrollPhysics(),

          itemCount: items.length,
          itemBuilder: (context, i) {
            final product = items[i];
            debugPrint("order: $product");
            final String imageURL = product["imageUrl"].toString();
            Widget imageBody;
            if (imageURL != "") {
              if (imageURL.contains("http")) {
                imageBody = Image.network(imageURL);
              } else {
                String base64String = imageURL.split(',').last;
                imageBody = Image.memory(base64Decode(base64String));
              }
            } else
              imageBody = const Icon(Icons.image, size: 40);

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
                      child: imageBody,
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
                              ],
                            ),
                          ),
                          Spacer(),
                          Column(
                            children: [
                              SizedBox(
                                width: 100,
                                height: 30,
                                child: OutlinedButton(
                                  onPressed: () =>
                                      _clickProduct(product["product"]),
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
      },
    );
  }

  Widget _buildOrderCard(dynamic order, {required bool showCancel}) {
    return Row(
      children: [
        Container(
          width: double.infinity,
          margin: EdgeInsets.all(12),
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.teal.shade50,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Theme.of(context).colorScheme.secondaryContainer,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                order["title"] ?? "No title",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              SizedBox(height: 4),
              Text(
                order["description"] ?? "No description",
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 14),
              ),
              SizedBox(height: 4),
              Text(
                "Location: ${order["location"] ?? "Unknown"}",
                style: TextStyle(
                  fontSize: 12,
                  color: Theme.of(context).colorScheme.onSecondaryContainer,
                ),
              ),
              SizedBox(height: 4),
              Text(
                "Price: \$${order["price"] ?? 0}",
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
        Spacer(),
      ],
    );
  }

  // -------------------------------------------
  // EMPTY STATE
  // -------------------------------------------
  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, size: 64, color: Colors.grey),
        const SizedBox(height: 12),
        Text(
          title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        if (subtitle.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(subtitle, style: const TextStyle(color: Colors.grey)),
          ),
        if (actionLabel != null)
          TextButton(onPressed: onAction, child: Text(actionLabel)),
      ],
    );
  }

  // -------------------------------------------
  // CANCEL ORDER DIALOG
  // -------------------------------------------
  void _showCancelDialog(String id) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Cancel Order"),
          content: const Text(
            "Are you sure you want to cancel your cart?? The products will become available again.",
          ),
          actions: [
            TextButton(
              child: const Text("Keep Cart"),
              onPressed: () async {
                Navigator.pop(context);
              },
            ),
            ElevatedButton(
              child: const Text("Cancel Cart"),
              onPressed: () async {
                await ApiRequests().cancelOrder(id);
                Navigator.pop(context);
                await getOrders();
              },
            ),
          ],
        );
      },
    );
  }
}
