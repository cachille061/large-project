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
  bool resettingPassword = false;
  String resetPasswordResponse = "";

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

  void _resetPassword(String email) async {
    final success = await ApiRequests().resetPassword(email);
    if (success) {
      setState(
        () => resetPasswordResponse =
            "Reset password instructions sent to $email",
      );
    } else {
      setState(() => resetPasswordResponse = "Please try again!");
    }
  }

  @override
  Widget build(BuildContext context) {
    String loginText = "Login";
    if (resettingPassword) loginText = "Password Reset";
    final colors = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: Text(loginText),
        backgroundColor: colors.primaryContainer,
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
          if (!resettingPassword)
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
          if (!resettingPassword)
            TextButton(
              onPressed: () => setState(() => resettingPassword = true),
              child: const Text("Reset Password"),
            ),
          if (!resettingPassword)
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
          if (resettingPassword)
            SizedBox(
              width: 250,
              height: 150,
              child: Padding(
                padding: EdgeInsetsGeometry.all(20),
                child: FloatingActionButton(
                  onPressed: () => _resetPassword(emailControl.text),
                  child: const Text("Send Instructions"),
                ),
              ),
            ),
          if (resetPasswordResponse != "")
            Card(
              color: colors.surface,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 16,
                ),
                child: Text(
                  resetPasswordResponse,
                  style: TextStyle(color: colors.onSurface),
                ),
              ),
            ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: Text(errorText),
          ),
        ],
      ),
      bottomNavigationBar: NavBar(),
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
