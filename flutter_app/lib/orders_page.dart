import 'package:flutter/material.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/api_requests.dart';

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

  dynamic orderToCancel; // selected order

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    getOrders();
  }

  void getOrders() async {
    final (List, List) orders = await ApiRequests().getOrders();
    setState(() {
      pendingOrders = orders.$1;
      completedOrders = orders.$2;
      allOrders = orders.$1 + orders.$2;
      debugPrint(allOrders.toString());
    });
  }

  void _homeButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Listings"),
        backgroundColor: colors.primaryContainer,
      ),
      body: Center(
        child: Column(
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
                : _buildTabs(),
          ],
        ),
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
              Tab(text: "All Orders (${allOrders.length})"),
              Tab(text: "Pending (${pendingOrders.length})"),
              Tab(text: "Completed (${completedOrders.length})"),
              Tab(text: "Cancelled (${cancelledOrders.length})"),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOrderList(allOrders, showCancel: true),
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
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 16),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        return _buildOrderCard(order, showCancel: showCancel);
      },
    );
  }

  Widget _buildOrderCard(dynamic order, {required bool showCancel}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text("Order #${order["id"]}"),
        subtitle: Text("Order details..."),
        trailing: showCancel
            ? TextButton(
                child: const Text("Cancel"),
                onPressed: () {
                  setState(() => orderToCancel = order);
                  _showCancelDialog();
                },
              )
            : null,
      ),
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
  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Cancel Order"),
          content: const Text(
            "Are you sure you want to cancel this order? The product will become available again.",
          ),
          actions: [
            TextButton(
              child: const Text("Keep Order"),
              onPressed: () => Navigator.pop(context),
            ),
            ElevatedButton(
              child: const Text("Cancel Order"),
              onPressed: () {
                // handle cancel logic
                Navigator.pop(context);
              },
            ),
          ],
        );
      },
    );
  }
}
