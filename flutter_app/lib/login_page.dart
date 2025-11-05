import 'package:flutter/material.dart';
import 'package:flutter_app/main.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => MyCustomForm();
}

class MyCustomForm extends State<LoginPage> {
  final usernameControl = TextEditingController();
  final passwordControl = TextEditingController();
  final usernameTest = "test";
  final passwordTest = "1234";
  var errorText = "";

  @override
  initState() {
    super.initState();
    usernameControl.addListener(() {
      setState(() {});
    });
    passwordControl.addListener(() {
      setState(() {});
    });
  }

  _login() {
    final success =
        (usernameControl.text == usernameTest &&
        passwordControl.text == passwordTest);
    if (success) {
      Navigator.push(
        context,
        MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
      );
    } else {
      setState(() {
        errorText = "Invalid Username or Password!";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your username',
              ),
              controller: usernameControl,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your password',
              ),
              controller: passwordControl,
            ),
          ),
          SizedBox(
            width: 250,
            child: Padding(
              padding: EdgeInsetsGeometry.all(20),
              child: FloatingActionButton(
                onPressed: () => _login(),
                child: const Text("Login", style: TextStyle(fontSize: 24)),
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
    usernameControl.dispose();
    passwordControl.dispose();
    super.dispose();
  }
}
