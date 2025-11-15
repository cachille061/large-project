import 'package:flutter/material.dart';
import 'package:flutter_app/listings.dart';
import 'package:flutter_app/login_page.dart';
import 'package:flutter_app/product_details.dart';
import 'package:flutter_app/sign_up_page.dart';
import 'package:flutter_app/api_requests.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/services.dart';
import 'package:flutter_app/add_product_page.dart';
import 'package:flutter_app/orders_page.dart';
import 'package:http/http.dart';

late String BACKEND_URL;
final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();
// This function can be changed to something else by the search menu
Future<List> Function() searchFunc = () async {
  return await ApiRequests().getProducts();
};
const CATEGORIES = [
  "Computer Parts",
  "Storage & Memory",
  "Keyboards",
  "Mice & Peripherals",
  "Audio & Headphones",
  "Phones & Tablets",
  "Cameras & Webcams",
  "Printers & Scanners",
  "Networking",
  "Cables * Accessories",
  "Gaming Consoles",
  "Streaming Equipment",
];
const DISPLAY_CONDITIONS = [
  "New",
  "Used - Like New",
  "Used - Excellent",
  "Used - Fair",
  "Used - Poor",
];
const Map<String, String> DISPLAY_TO_VALID_CONDITION = {
  "New": 'new',
  "Used - Like New": 'like-new',
  "Used - Excellent": 'good',
  "Used - Fair": 'fair',
  "Used - Poor": 'poor',
};
const Map<String, String> VALID_TO_DISPLAY_CONDITION = {
  'new': 'New',
  'like-new': 'Used - Like New',
  'good': 'Used - Excellent',
  'fair': 'Used - Fair',
  'poor': 'Used - Poor',
};

Future<void> main() async {
  await dotenv.load();
  BACKEND_URL = (dotenv.env['API_URL'] ?? '');
  if (BACKEND_URL == '') throw Error();
  await ApiRequests().setup();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'COP4331 Group 2',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
      ),
      home: const HomePage(),
      navigatorObservers: [routeObserver],
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  void reloadState() {
    setState(() {});
  }

  final GlobalKey<_ProductsListState> _productsListKey = GlobalKey();

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 0),
              child: Image.asset("assets/logo_1.png"),
            ),
            Spacer(),
            AccountMenu(onLogout: () => reloadState()),
          ],
        ),
        backgroundColor: colors.primaryContainer,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [ProductsList(key: _productsListKey)],
        ),
      ),
      bottomNavigationBar: NavBar(
        showSearch: true,
        onExitSearch: () => _productsListKey.currentState?.getProducts(),
      ),
    );
  }
}

class ProductsList extends StatefulWidget {
  const ProductsList({super.key});

  @override
  State<ProductsList> createState() => _ProductsListState();
}

class _ProductsListState extends State<ProductsList> with RouteAware {
  List<dynamic> products = [];
  bool loading = false;
  bool loadingError = false;

  void getProducts() async {
    setState(() {
      loading = true;
      loadingError = false;
    });

    try {
      final fetchedProducts = await searchFunc();
      setState(() {
        products = fetchedProducts;
        loading = false;
      });
    } catch (error) {
      setState(() {
        debugPrint(error.toString());
        loadingError = true;
        loading = false;
      });
    }
  }

  @override
  initState() {
    super.initState();
    debugPrint("Initializing state");
    getProducts();
  }

  void _clickProduct(String id) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => ProductDetailPage(productId: id),
      ),
    );
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
    if (loading) {
      return Text("loading...");
    } else if (loadingError == true) {
      return Text("Failed to load products!");
    } else if (products.isEmpty) {
      return Text("No Products to show!");
    }

    return Expanded(
      child: SingleChildScrollView(
        padding: EdgeInsets.all(8),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (var product in products)
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.teal.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Theme.of(context).colorScheme.secondaryContainer,
                  ),
                ),
                child: InkWell(
                  onTap: () => _clickProduct(product["_id"]),

                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product["title"] ?? "No title",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        product["description"] ?? "No description",
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 14),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "Location: ${product["location"] ?? "Unknown"}",
                        style: TextStyle(
                          fontSize: 12,
                          color: Theme.of(
                            context,
                          ).colorScheme.onSecondaryContainer,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "Price: \$${product["price"] ?? 0}",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
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
    ;
  }
}

class SearchMenu extends StatefulWidget {
  const SearchMenu({super.key});

  @override
  State<SearchMenu> createState() => _SearchMenuState();
}

class _SearchMenuState extends State<SearchMenu> {
  static final List<String> selectedCategories = [];
  static final List<String> selectedConditions = [];
  static String savedSearch = "";
  static String savedMin = "";
  static String savedMax = "";
  static String savedLocation = "";
  final searchText = TextEditingController();
  final minPrice = TextEditingController();
  final maxPrice = TextEditingController();
  final location = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (savedSearch != "") searchText.text = savedSearch;
    searchText.addListener(() {
      savedSearch = searchText.text;
      setSearchFunc();
    });
    if (savedMin != "") minPrice.text = savedMin;
    minPrice.addListener(() {
      savedMin = minPrice.text;
      setSearchFunc();
    });
    if (savedMax != "") maxPrice.text = savedMax;
    maxPrice.addListener(() {
      savedMax = maxPrice.text;
      setSearchFunc();
    });
    if (savedLocation != "") location.text = savedLocation;
    location.addListener(() {
      savedLocation = location.text;
      setSearchFunc();
    });
  }

  void setSearchFunc() {
    if (searchText.text.isEmpty &&
        selectedCategories.isEmpty &&
        selectedConditions.isEmpty &&
        minPrice.text.isEmpty &&
        maxPrice.text.isEmpty &&
        location.text.isEmpty) {
      searchFunc = () async {
        return await ApiRequests().getProducts();
      };
    } else {
      searchFunc = () async {
        return await ApiRequests().searchProducts(
          query: searchText.text.isEmpty ? null : searchText.text,
          category: selectedCategories.isEmpty ? null : selectedCategories[0],
          condition: selectedConditions.isEmpty ? null : selectedConditions[0],
          minPrice: minPrice.text.isEmpty ? null : double.parse(minPrice.text),
          maxPrice: maxPrice.text.isEmpty ? null : double.parse(maxPrice.text),
        );
      };
    }
  }

  void clearFilters() {
    searchText.clear();
    minPrice.clear();
    maxPrice.clear();
    location.clear();
    setState(() {
      savedSearch = "";
      savedMin = "";
      savedMax = "";
      savedLocation = "";
      selectedConditions.clear();
      selectedCategories.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextButton(child: Text("Reset Filters"), onPressed: clearFilters),
          TextField(
            controller: searchText,
            decoration: InputDecoration(
              labelText: 'Search products',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.search),
            ),
          ),
          TextFormField(
            decoration: const InputDecoration(
              border: UnderlineInputBorder(),
              labelText: 'Location',
            ),
            controller: location,
          ),
          TextFormField(
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            decoration: const InputDecoration(
              border: UnderlineInputBorder(),
              labelText: 'Minimum Price',
            ),
            controller: minPrice,
          ),
          TextFormField(
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            decoration: const InputDecoration(
              border: UnderlineInputBorder(),
              labelText: 'Maximum Price',
            ),
            controller: maxPrice,
          ),
          const SizedBox(height: 16),
          Align(alignment: Alignment.centerLeft, child: Text('Categories')),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              for (var category in CATEGORIES)
                ChoiceChip(
                  label: Text(category),
                  selected: selectedCategories.contains(category),
                  onSelected: (isSelected) {
                    setState(() {
                      if (isSelected) {
                        selectedCategories.add(category);
                      } else {
                        selectedCategories.remove(category);
                      }
                    });
                  },
                ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    // Remove listeners but DO NOT dispose static controllers
    searchText.dispose();
    minPrice.dispose();
    maxPrice.dispose();
    location.dispose();
    super.dispose();
  }
}

class AccountMenu extends StatefulWidget {
  final Function onLogout;
  const AccountMenu({super.key, required this.onLogout});

  @override
  State<AccountMenu> createState() => _AccountMenuState();
}

class _AccountMenuState extends State<AccountMenu> {
  void _loginButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => const LoginPage(),
      ),
    );
  }

  void _signupButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => const SignUpPage(),
      ),
    );
  }

  void _logoutButton(BuildContext context) async {
    await ApiRequests().signOut();
    setState(() {
      widget.onLogout();
    });
    return;
  }

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<int>(
      icon: Icon(Icons.more_vert),
      onSelected: (int result) {
        if (!ApiRequests.loggedIn) {
          if (result == 1) {
            _loginButton(context);
          } else if (result == 2) {
            _signupButton(context);
          }
        } else {
          if (result == 3) {
            _logoutButton(context);
          }
        }
      },
      itemBuilder: (BuildContext context) {
        if (!ApiRequests.loggedIn) {
          return [
            PopupMenuItem<int>(value: 1, child: Text('Login')),
            PopupMenuItem<int>(value: 2, child: Text('Sign Up')),
          ];
        } else {
          return [PopupMenuItem<int>(value: 3, child: Text('Logout'))];
        }
      },
    );
  }
}

class NavBar extends StatefulWidget {
  final Function onExitSearch;
  final bool showSearch;
  const NavBar({
    super.key,
    this.showSearch = false,
    this.onExitSearch = _emptyFunc,
  });

  @override
  State<NavBar> createState() => _NavBarState();

  static _emptyFunc() {}
}

class _NavBarState extends State<NavBar> {
  @override
  void initState() {
    super.initState();
  }

  _searchButton(BuildContext context) async {
    await showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return const SearchMenu();
      },
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
    );
    widget.onExitSearch();
  }

  void _addProductButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => AddEditProductPage(),
      ),
    );
  }

  void _homeButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
    );
  }

  void _listingsButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => MyListingsPage(),
      ),
    );
  }

  void _historyButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(builder: (BuildContext context) => OrdersPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colors = Theme.of(context).colorScheme;

    return Padding(
      padding: EdgeInsets.all(10),
      child: Container(
        height: 40,
        decoration: BoxDecoration(
          color: colors.primaryContainer,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            if (widget.showSearch)
              IconButton(
                icon: Icon(Icons.search),
                color: colors.onPrimaryContainer,
                onPressed: () => {_searchButton(context)},
              ),
            IconButton(
              icon: Icon(Icons.home),
              color: colors.onPrimaryContainer,
              onPressed: () => _homeButton(context),
            ),
            if (ApiRequests.loggedIn)
              IconButton(
                icon: Icon(Icons.add),
                color: colors.onPrimaryContainer,
                onPressed: () => _addProductButton(context),
              ),
            if (ApiRequests.loggedIn)
              IconButton(
                icon: Icon(Icons.storefront),
                color: colors.onPrimaryContainer,
                onPressed: () => {_listingsButton(context)},
              ),
            if (ApiRequests.loggedIn)
              IconButton(
                icon: Icon(Icons.history),
                color: colors.onPrimaryContainer,
                onPressed: () {
                  _historyButton(context);
                },
              ),
          ],
        ),
      ),
    );
  }
}
