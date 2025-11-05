import 'package:flutter/material.dart';
import 'package:flutter_app/login_page.dart';
import 'package:flutter_app/sign_up_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'COP4331 Group 2',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

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

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Text('MyTechMarketplace'),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: SizedBox(
                width: 100,
                child: FloatingActionButton(
                  onPressed: () => _loginButton(context),
                  child: const Text("Login", style: TextStyle(fontSize: 24)),
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: SizedBox(
                width: 100,
                child: FloatingActionButton(
                  onPressed: () => _signupButton(context),
                  child: const Text("Sign Up", style: TextStyle(fontSize: 24)),
                ),
              ),
            ),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [ProductsList()],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.all(5),
        child: Container(
          color: Theme.of(context).secondaryHeaderColor,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(icon: Icon(Icons.search), onPressed: () {}),
              IconButton(icon: Icon(Icons.home), onPressed: () {}),
              IconButton(icon: Icon(Icons.sell), onPressed: () {}),
              IconButton(icon: Icon(Icons.history), onPressed: () {}),
            ],
          ),
        ),
      ),
    );
  }
}

class ProductsList extends StatefulWidget {
  const ProductsList({super.key});

  @override
  State<ProductsList> createState() => _ProductsListState();
}

class _ProductsListState extends State<ProductsList> {
  final products = [
    "Razer Keyboard",
    "Logitech Gaming Mouse",
    "Corsair Mechanical Keyboard",
    "ASUS ROG Gaming Laptop",
    "Dell Ultrasharp Monitor",
    "Apple MacBook Pro",
    "Samsung SSD 1TB",
    "NVIDIA GeForce RTX 4090",
    "AMD Ryzen 9 Processor",
    "HyperX Cloud II Headset",
    "SteelSeries Mouse Pad",
    "Elgato Stream Deck",
    "Logitech Brio Webcam",
    "Anker USB-C Hub",
    "Sony WH-1000XM5 Headphones",
    "Raspberry Pi 5",
    "Intel Core i9 CPU",
    "ASUS TUF Motherboard",
    "Crucial DDR5 RAM 32GB",
    "WD Black NVMe SSD 2TB",
  ];

  @override
  Widget build(BuildContext context) {
    return Column(children: [for (var product in products) Text(product)]);
  }
}
