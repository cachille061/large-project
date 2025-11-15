import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/api_requests.dart';

class AddProductPage extends StatefulWidget {
  const AddProductPage({super.key});

  @override
  State<AddProductPage> createState() => AddProductPageState();
}

class AddProductPageState extends State<AddProductPage> {
  final productTitle = TextEditingController();
  final price = TextEditingController();
  final location = TextEditingController();
  final description = TextEditingController();
  final imageURL = TextEditingController();
  String? selectedCategory;
  String? selectedCondition;
  String errorText = "";

  @override
  void initState() {
    super.initState();
    productTitle.addListener(() {
      setState(() {});
    });
    price.addListener(() {
      setState(() {});
    });
    location.addListener(() {
      setState(() {});
    });
    description.addListener(() {
      setState(() {});
    });
    imageURL.addListener(() {
      setState(() {});
    });
  }

  void _addProductButton() async {
    if (productTitle.text == '' ||
        price.text == '' ||
        description.text == '' ||
        selectedCategory == null ||
        selectedCondition == null) {
      errorText = "Not all required fields are filled out!";
      return;
    }
    if (productTitle.text.length < 3 || productTitle.text.length > 100) {
      errorText = "Title must be between 3 and 100 characters";
      return;
    }
    if (description.text.length < 10 || description.text.length > 2000) {
      errorText = "Description must be between 10 and 2000 characters";
      return;
    }
    // Price must be a valid number and >= 0
    final priceValue = double.tryParse(price.text);
    if (priceValue == null) {
      errorText = "Price must be a valid number";
      return;
    }
    if (priceValue < 0) {
      errorText = "Price cannot be negative";
      return;
    }
    final result = await ApiRequests().addProduct(
      title: productTitle.text,
      price: double.parse(price.text),
      description: description.text,
      condition: DISPLAY_TO_VALID_CONDITION[selectedCondition] ?? '',
      category: selectedCategory ?? '',
      location: location.text,
    );
    debugPrint(result.$2);
    if (result.$1 == true) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AddProduct'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Product Title *',
              ),
              controller: productTitle,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Price *',
              ),
              controller: price,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Location *',
              ),
              controller: location,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: InputDecorator(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Category *',
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: selectedCategory,
                  hint: Text('Select Category'),
                  isExpanded: true,
                  items: CATEGORIES.map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      selectedCategory = newValue;
                    });
                  },
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: InputDecorator(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Condition *',
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: selectedCondition,
                  hint: Text('Select Condition'),
                  isExpanded: true,
                  items: DISPLAY_CONDITIONS.map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      selectedCondition = newValue;
                    });
                  },
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Description *',
              ),
              controller: description,
            ),
          ),
          SizedBox(
            width: 250,
            child: Padding(
              padding: EdgeInsetsGeometry.all(20),
              child: FloatingActionButton(
                onPressed: () => _addProductButton(),
                child: const Text(
                  "List Product",
                  style: TextStyle(fontSize: 24),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: Text(errorText),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    productTitle.dispose();
    price.dispose();
    description.dispose();
    location.dispose();
    imageURL.dispose();
    super.dispose();
  }
}
