import 'package:flutter/material.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/api_requests.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  final emailControl = TextEditingController();
  final passwordControl = TextEditingController();
  final emailTest = "test";
  final passwordTest = "1234";
  var errorText = "";

  @override
  void initState() {
    super.initState();
    emailControl.addListener(() {
      setState(() {});
    });
    passwordControl.addListener(() {
      setState(() {});
    });
  }

  _login() async {
    final result = await ApiRequests().signInWithEmail(
      emailControl.text,
      passwordControl.text,
    );
    if (result == "success") {
      Navigator.push(
        context,
        MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
      );
    } else {
      setState(() {
        errorText = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
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
                labelText: 'Enter your email',
              ),
              controller: emailControl,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              obscureText: true,
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
    emailControl.dispose();
    passwordControl.dispose();
    super.dispose();
  }
}
