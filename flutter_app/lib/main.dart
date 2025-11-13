import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_app/login_page.dart';
import 'package:flutter_app/sign_up_page.dart';
import 'package:flutter_app/api_requests.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_app/add_product_page.dart';
import 'dart:developer';
import 'package:flutter/foundation.dart';

late String BACKEND_URL;
final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();
bool searching = false;
const categories = [
  "Laptops & Computers",
  "Monitors & Displays",
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
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Text(
                'MyTechMarketplace',
                selectionColor: colors.onPrimaryContainer,
              ),
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
          children: [ProductsList()],
        ),
      ),
      bottomNavigationBar: NavBar(),
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
      var fetchedProducts;
      if (!searching) {
        fetchedProducts = await ApiRequests().getAllProducts();
      } else {
        fetchedProducts = await ApiRequests().searchProducts();
      }
      setState(() {
        products = fetchedProducts;
        loading = false;
      });
    } catch (error) {
      setState(() {
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
    return Column(
      children: [for (var product in products) Text(product["title"])],
    );
  }
}

class SearchMenu extends StatefulWidget {
  const SearchMenu({super.key});

  @override
  State<SearchMenu> createState() => _SearchMenuState();
}

class _SearchMenuState extends State<SearchMenu> {
  final searchTextCtrl = TextEditingController();
  final List<String> selectedCategories = [];

  @override
  void initState() {
    super.initState();
    searchTextCtrl.addListener(() {
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: searchTextCtrl,
            decoration: InputDecoration(
              labelText: 'Search products',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.search),
            ),
          ),
          const SizedBox(height: 16),
          Align(alignment: Alignment.centerLeft, child: Text('Categories')),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              for (var category in categories)
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
  const NavBar({super.key});

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {
  @override
  void initState() {
    super.initState();
  }

  _searchButton(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return const SearchMenu();
      },
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
    );
  }

  void _addProductButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (BuildContext context) => AddProductPage(),
      ),
    );
  }

  void _homeButton(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colors = Theme.of(context).colorScheme;

    return Padding(
      padding: EdgeInsets.all(5),
      child: Container(
        height: 40,
        decoration: BoxDecoration(
          color: colors.primaryContainer,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
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
            IconButton(
              icon: Icon(Icons.history),
              color: colors.onPrimaryContainer,
              onPressed: () {},
            ),
          ],
        ),
      ),
    );
  }
}
